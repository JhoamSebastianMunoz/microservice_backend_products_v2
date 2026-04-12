import { Pool } from 'pg';
import dotenv from "dotenv";
dotenv.config();

const sslConfig = process.env.DB_SSL === 'true'
  ? { rejectUnauthorized: false } // o true si cuentas con el certificado adecuado
  : undefined;

const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT) || 5432,
  ssl: sslConfig,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default db;
