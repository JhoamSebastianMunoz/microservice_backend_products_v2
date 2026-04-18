import express from "express";
import bodyParser from 'body-parser';
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs"; // 
import cors from 'cors';
import path from 'path';
import fs from 'fs';

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
const swaggerPath = path.resolve(__dirname, "./swagger.yaml");
const swaggerPathAlt = path.resolve(__dirname, "../swagger.yaml");
const swaggerDocument = YAML.load(fs.existsSync(swaggerPath) ? swaggerPath : swaggerPathAlt);
// verificar si el servidor esta funcionando
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>API de Productos TATSoft v2</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          padding: 60px 40px;
          max-width: 700px;
          text-align: center;
        }
        h1 {
          color: #667eea;
          font-size: 2.5rem;
          margin-bottom: 20px;
          font-weight: 700;
        }
        .badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 20px;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 25px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .description {
          color: #555;
          font-size: 1.1rem;
          line-height: 1.8;
          margin-bottom: 35px;
        }
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        .feature {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 12px;
          border-left: 4px solid #667eea;
        }
        .feature strong {
          display: block;
          color: #667eea;
          font-size: 1.2rem;
          margin-bottom: 5px;
        }
        .feature span {
          color: #777;
          font-size: 0.9rem;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 18px 45px;
          border-radius: 50px;
          text-decoration: none;
          font-size: 1.1rem;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }
        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(102, 126, 234, 0.6);
        }
        .cta-button svg {
          display: inline-block;
          vertical-align: middle;
          margin-right: 10px;
          width: 20px;
          height: 20px;
        }
        .status {
          margin-top: 30px;
          padding-top: 30px;
          border-top: 2px solid #f0f0f0;
          color: #28a745;
          font-weight: 600;
        }
        .status::before {
          content: "●";
          margin-right: 8px;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @media (max-width: 600px) {
          .container {
            padding: 40px 25px;
          }
          h1 {
            font-size: 2rem;
          }
          .features {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <span class="badge">v2.0.0</span>
        <h1>API de Productos TATSoft</h1>
        <p class="description">
          Una API RESTful optimizada para la gestión completa de productos, categorías, imágenes y stock. 
          Diseñada con arquitectura SOLID y mejores prácticas de desarrollo para garantizar escalabilidad y mantenibilidad.
        </p>
        
        <div class="features">
          <div class="feature">
            <strong>📦 Productos</strong>
            <span>CRUD completo</span>
          </div>
          <div class="feature">
            <strong>📂 Categorías</strong>
            <span>Gestión organizada</span>
          </div>
          <div class="feature">
            <strong>🖼️ Imágenes</strong>
            <span>Upload & Storage</span>
          </div>
          <div class="feature">
            <strong>📊 Stock</strong>
            <span>Control de inventario</span>
          </div>
        </div>
        
        <a href="/api-docs" class="cta-button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          Ver Documentación Swagger
        </a>
        
        <div class="status">Servidor funcionando correctamente</div>
      </div>
    </body>
    </html>
  `);
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
