const { Pool } = require('pg');
require('dotenv').config();

console.log('=== DIAGNÓSTICO DE CONEXIÓN A SUPABASE ===');
console.log('');

// Mostrar variables de entorno (sin mostrar passwords)
console.log('Variables de entorno configuradas:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_SSL:', process.env.DB_SSL);
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('');

// Configuración de conexión
const sslConfig = process.env.DB_SSL === 'true'
  ? { rejectUnauthorized: false }
  : undefined;

const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT) || 5432,
  ssl: sslConfig,
  connectionTimeoutMillis: 5000,
});

async function testConnection() {
  try {
    console.log('Intentando conectar a la base de datos...');
    const client = await db.connect();
    console.log('¡Conexión exitosa!');
    
    // Probar consulta simple
    const result = await client.query('SELECT NOW() as current_time, version() as postgres_version');
    console.log('Resultado de prueba:');
    console.log('Fecha actual:', result.rows[0].current_time);
    console.log('Versión PostgreSQL:', result.rows[0].postgres_version);
    
    // Probar consulta a tablas del proyecto
    console.log('');
    console.log('Verificando tablas del proyecto...');
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('productos', 'categorias', 'registro_stock')
      ORDER BY table_name
    `;
    const tablesResult = await client.query(tablesQuery);
    
    if (tablesResult.rows.length > 0) {
      console.log('Tablas encontradas:');
      tablesResult.rows.forEach(row => {
        console.log('- ' + row.table_name);
      });
    } else {
      console.log('No se encontraron las tablas del proyecto. ¿Se ejecutó el script SQL?');
    }
    
    client.release();
    console.log('');
    console.log('=== CONEXIÓN VERIFICADA EXITOSAMENTE ===');
    
  } catch (error) {
    console.error('Error de conexión:');
    console.error('Código:', error.code);
    console.error('Mensaje:', error.message);
    console.error('');
    
    if (error.code === 'ENOTFOUND') {
      console.error('SOLUCIÓN:');
      console.error('1. Verifica que DB_HOST en tu .env sea el servidor correcto de Supabase');
      console.error('2. Revisa tu dashboard de Supabase > Settings > Database');
      console.error('3. Copia la URL de conexión correcta');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('SOLUCIÓN:');
      console.error('1. Verifica el puerto (usualmente 5432)');
      console.error('2. Revisa credenciales de usuario');
      console.error('3. Confirma que la base de datos esté activa');
    } else if (error.code === '28P01') {
      console.error('SOLUCIÓN:');
      console.error('1. Verifica DB_USERNAME y DB_PASSWORD');
      console.error('2. Usa las credenciales de PostgreSQL de Supabase');
    }
  } finally {
    await db.end();
  }
}

testConnection();
