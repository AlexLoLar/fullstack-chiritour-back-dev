const express = require('express');
const multer = require('multer');
const AzureBlobController = require('../controllers/AzureBlobController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Configuración de multer para manejo de archivos

/**
 * @swagger
 * /api/azure/upload:
 *   post:
 *     summary: Sube un archivo a Azure Blob Storage
 *     tags: [Azure]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: El archivo que se desea subir a Azure Blob Storage
 *     responses:
 *       200:
 *         description: Archivo subido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: URL pública del archivo subido
 *       201:
 *         description: Archivo creado exitosamente (cuando se utiliza para crear un recurso nuevo)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: URL pública del archivo subido
 *       400:
 *         description: No se subió ningún archivo
 *       500:
 *         description: Error al subir archivo a Azure Blob Storage
 */
router.post('/upload', upload.single('file'), AzureBlobController.uploadFile);

module.exports = router;
