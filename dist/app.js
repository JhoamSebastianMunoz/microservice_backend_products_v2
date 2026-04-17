"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs")); // 
const cors_1 = __importDefault(require("cors"));
// Legacy routes removed - API v2 only
// V2 API Routes
const products_1 = __importDefault(require("./routes/v2/products"));
const categories_1 = __importDefault(require("./routes/v2/categories"));
const images_1 = __importDefault(require("./routes/v2/images"));
const stock_1 = __importDefault(require("./routes/v2/stock"));
const reports_1 = __importDefault(require("./routes/v2/reports"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)().use(body_parser_1.default.json());
// Cargar archivo YAML de Swagger
const swaggerDocument = yamljs_1.default.load("./swagger.yaml");
// verificar si el servidor esta funcionando
app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});
// Montar la documentación Swagger en la ruta `/api-docs`
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
const allowedOrigins = [
    'http://localhost:10102',
    'http://localhost:5173', // Frontend en desarrollo
    'https://microservice-backend-products-v2.vercel.app' // despliegue en Vercel
];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('No permitido por CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
// API v2 Routes - RESTful naming conventions
app.use('/api/v2/products', products_1.default);
app.use('/api/v2/categories', categories_1.default);
app.use('/api/v2/images', images_1.default);
app.use('/api/v2/stock', stock_1.default);
app.use('/api/v2/reports', reports_1.default);
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
exports.default = app;
