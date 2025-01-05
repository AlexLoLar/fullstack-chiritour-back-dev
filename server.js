const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models/Reserva_SQL');
const reservasRoutes = require('./routes/reservasRoutesSQL');
const usersRoutesSQL = require('./routes/usersRoutesSQL');
const dropboxRoutes = require('./routes/dropboxRoutes');
const azureBlobRoutes = require('./routes/azureBlobRoutes');
const localitationsRoutes = require('./routes/locationsRoutes');
const routesRoutes = require('./routes/routesRoutesSQL');
const experiencesRoutes = require('./routes/experiencesRoutes');
const bookingsRoutes = require('./routes/bookingsRoutes');
const plansRoutes = require('./routes/plansRoutes');
const buyersRoutes = require('./routes/buyersRoutes');
const quotasRoutes = require('./routes/quotasRoutes');
const multimediaRoutes = require('./routes/multimediasRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const path = require('path');
const cors = require('cors')
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;
app.use(bodyParser.json());

// Configuración de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const corsOptions = {
  origin: '*',  // Permite solicitudes desde cualquier origen
  methods: 'GET,POST,PUT,DELETE',  // Métodos permitidos
  allowedHeaders: 'Content-Type, Authorization',  // Encabezados permitidos
};

app.use(cors(corsOptions));

app.use(express.static('public')); 
app.use('/api/reservas', reservasRoutes);
app.use('/api/users', usersRoutesSQL);
app.use('/api/dropbox', dropboxRoutes);
app.use('/api/azure', azureBlobRoutes);
app.use('/api/locations', localitationsRoutes);
app.use('/api/routes', routesRoutes);
app.use('/api/experiences', experiencesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/plans', plansRoutes);
app.use('/api/buyers', buyersRoutes);
app.use('/api/quotas', quotasRoutes);
app.use('/api/multimedia', multimediaRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Conexión a la base de datos y servidor
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    console.log(`Servidor corriendo en http://localhost:${port}/api-docs`);
    console.log('Conectado a la base de datos MySQL server');
  });
}).catch(err => {
  console.error('Error al conectar a MySQL:', err.message);
});
