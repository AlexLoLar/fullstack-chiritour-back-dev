const { BlobServiceClient } = require('@azure/storage-blob');
const fs = require('fs');
require('dotenv').config();

// Configuración del cliente de Azure Blob Storage
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error('Falta la conexión a Azure Storage en las variables de entorno.');
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

const AzureBlobController = {
  // Subir archivo a Azure Blob Storage y devolver el enlace público
  uploadFile: async (req) => {
    try {
      // Verificar que se subió un archivo
      if (!req.file) {
        throw new Error('No se subió ningún archivo.');
      }

      const filePath = req.file.path; // Ruta temporal del archivo
      const fileName = req.file.originalname; // Nombre original del archivo
      const containerName = 'chiritour-container'; // Nombre del contenedor en Azure Blob Storage

      // Obtener el cliente del contenedor
      const containerClient = blobServiceClient.getContainerClient(containerName);

      // Crear el contenedor si no existe
      await containerClient.createIfNotExists();

      // Detectar el tipo de archivo (por ejemplo, para imágenes PNG)
      const mimeType = 'image/png';  // Asegúrate de especificar el tipo correcto si lo conoces
      // Si necesitas obtener el tipo de contenido dinámicamente, puedes usar una librería como `mime-types`
      // const mimeType = require('mime-types').lookup(fileName);

      // Subir archivo al contenedor con el tipo de contenido especificado
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);
      const uploadOptions = {
        blobHTTPHeaders: {
          blobContentType: mimeType // Establecer el tipo de contenido
        }
      };
      const uploadResponse = await blockBlobClient.uploadFile(filePath, uploadOptions);

      console.log(`Subida completada: ${uploadResponse._response.status}`);

      // Generar enlace público
      const publicUrl = blockBlobClient.url;

      // Eliminar archivo temporal local
      fs.unlinkSync(filePath);

      // Devolver la URL pública del archivo
      return {
        url: publicUrl, // Enlace público del archivo
      };
    } catch (error) {
      console.error(`Error al subir archivo: ${error.message}`);
      throw new Error(`Error al subir archivo a Azure Blob Storage: ${error.message}`);
    }
  },
};

module.exports = AzureBlobController;
