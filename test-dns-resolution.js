const dns = require('dns').promises;
const { Pool } = require('pg');
require('dotenv').config();

console.log('=== DIAGNÓSTICO AVANZADO DE CONEXIÓN ===');
console.log('');

async function testDNSResolution() {
  const host = process.env.DB_HOST;
  console.log(`Probando resolución DNS para: ${host}`);
  
  try {
    // Intentar resolución DNS
    const addresses = await dns.resolve4(host);
    console.log('Direcciones IP encontradas:', addresses);
    
    // Probar conexión con IP directa
    console.log('\nProbando conexión con IP directa...');
    const db = new Pool({
      host: addresses[0],
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: Number(process.env.DB_PORT) || 5432,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
    });
    
    const client = await db.connect();
    const result = await client.query('SELECT NOW() as current_time');
    console.log('¡Conexión exitosa con IP directa!');
    console.log('Fecha:', result.rows[0].current_time);
    client.release();
    await db.end();
    
  } catch (error) {
    console.error('Error en resolución DNS:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('\n=== SOLUCIÓN 1: Usar Session Pooler ===');
      console.log('El host directo no funciona. Intentando con Session Pooler...');
      
      try {
        const poolerHost = host.replace('db.', 'db.');
        const db = new Pool({
          host: poolerHost,
          user: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          port: 6543, // Puerto del session pooler
          ssl: { rejectUnauthorized: false },
          connectionTimeoutMillis: 5000,
        });
        
        const client = await db.connect();
        const result = await client.query('SELECT NOW() as current_time');
        console.log('¡Conexión exitosa con Session Pooler!');
        console.log('Fecha:', result.rows[0].current_time);
        client.release();
        await db.end();
        
      } catch (poolerError) {
        console.error('Error con Session Pooler:', poolerError.message);
      }
    }
  }
}

async function testAlternativeConnection() {
  console.log('\n=== SOLUCIÓN 2: Probar con URL completa ===');
  
  const connectionString = `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
  console.log('Intentando con connection string...');
  
  try {
    const db = new Pool({
      connectionString: connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
    });
    
    const client = await db.connect();
    const result = await client.query('SELECT NOW() as current_time');
    console.log('¡Conexión exitosa con connection string!');
    console.log('Fecha:', result.rows[0].current_time);
    client.release();
    await db.end();
    
  } catch (error) {
    console.error('Error con connection string:', error.message);
  }
}

async function main() {
  await testDNSResolution();
  await testAlternativeConnection();
  
  console.log('\n=== RECOMENDACIONES ===');
  console.log('1. Si ninguna de las opciones funciona, verifica tu conexión a internet');
  console.log('2. Revisa que tu proyecto Supabase esté activo');
  console.log('3. Considera usar IPv4 add-on si tienes problemas de red');
  console.log('4. Prueba desde una red diferente si es posible');
}

main().catch(console.error);
