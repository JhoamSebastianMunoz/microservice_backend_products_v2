import express from "express";
import bodyParser from 'body-parser';
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs"; // 
import cors from 'cors';
import path from 'path';

// Legacy routes removed - API v2 only

// V2 API Routes
import productsV2 from './routes/v2/products';
import categoriesV2 from './routes/v2/categories';
import imagesV2 from './routes/v2/images';
import stockV2 from './routes/v2/stock';
import reportsV2 from './routes/v2/reports';

import dotenv from "dotenv";
dotenv.config();

const app = express().use(bodyParser.json());
// Cargar archivo YAML de Swagger
const swaggerDocument = YAML.load("./swagger.yaml");
// verificar si el servidor esta funcionando
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});
// Montar la documentación Swagger en la ruta `/api-docs`
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const allowedOrigins = [
  'http://localhost:10102',
  'http://localhost:5173',  // Frontend en desarrollo
  'https://microservice-backend-products-v2.vercel.app' // despliegue en Vercel
];
const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
  credentials: true
};
app.use(cors(corsOptions));

// API v2 Routes - RESTful naming conventions
app.use('/api/v2/products', productsV2);
app.use('/api/v2/categories', categoriesV2);
app.use('/api/v2/images', imagesV2);
app.use('/api/v2/stock', stockV2);
app.use('/api/v2/reports', reportsV2);

// Legacy routes removed - API v2 only


// Configuración del puerto por donde correrá la aplicación
const PORT = process.env.PORT || 10102;

// Solo iniciar servidor en desarrollo (no en serverless/Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log("Servidor ejecutándose en el puerto: ", PORT);
  }).on("error", (error) => {
    throw new Error(error.message);
  });
}

export default app;
