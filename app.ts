import express from "express";
import bodyParser from 'body-parser';
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs"; // 
import cors from 'cors'

import register_product from './routes/productRoutes/register_product';
import get_products from './routes/productRoutes/get_products';
import get_product from './routes/productRoutes/get_product';
import delete_product from './routes/productRoutes/delete_product';
import update_product from './routes/productRoutes/update_product';
import product_images from './routes/productRoutes/product_images';
import register_stock from './routes/productRoutes/registre_stock';
import get_historicalStock from './routes/productRoutes/get__historicalStock';
import get_detailsStock from './routes/productRoutes/get_detailsStock';
import register_category from './routes/categoryRouter/register_category';
import getAll_category from './routes/categoryRouter/getAll_category';
import getById_category from './routes/categoryRouter/getById_category';
import update_category from './routes/categoryRouter/update_category';
import delete_category from './routes/categoryRouter/delete_category';

import  uploadImage from './routes/imageRoutes/upload_image_product';
import  getImage from './routes/imageRoutes/get_image';
import deleteImage from './routes/imageRoutes/delete_image';

import get_dataProduct from './routes/microservicePresaleRoutes/get_DataProduct';
import update_quantity from './routes/microservicePresaleRoutes/update_Quantity';

import get_productsLowStock from './routes/reportsRouter/getProductsLowStock';

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
  'http://localhost:10104',
  'http://localhost:5173',  // Frontend en desarrollo
  'https://ambitious-sky-070d67b0f.4.azurestaticapps.net',  // Frontend deployado
  'https://backendproducts-eefufaaeaahzauee.eastus-01.azurewebsites.net'
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

// Sentencia CRUD para productos
app.use('/register-product', register_product);
app.use('/get-products', get_products);
app.use('/get-product', get_product);
app.use('/delete-product', delete_product);
app.use('/update-product', update_product);
app.use('/products', product_images);
app.use('/register-stock', register_stock);
// Sentencia CRUD para stock
app.use('/get-hitoricalStock', get_historicalStock);
app.use('/get-detailsStock', get_detailsStock);
// Sentencia CRUD para categorias
app.use('/register-category', register_category);
app.use('/getAll-category', getAll_category);
app.use('/getById-category', getById_category);
app.use('/update-category', update_category);
app.use('/delete_category', delete_category);

// rutas para las imagenes usando el servicio de Azure
app.use('/upload-image', uploadImage);
app.use('/get-image', getImage);
app.use('/delete-image', deleteImage);

// rutas para peticiones del microservicio preventa
app.use('/api', get_dataProduct);
// Para actualizar la cantidad de productos
app.use('/api', update_quantity);

app.use('/estadisticasStockBajo', get_productsLowStock);


// Configuración del puerto por donde correrá la aplicación
const PORT = process.env.PORT || 10102;

app.listen(PORT, () => {
  console.log("Servidor ejecutándose en el puerto: ", PORT);
}).on("error", (error) => {
  throw new Error(error.message);
});
