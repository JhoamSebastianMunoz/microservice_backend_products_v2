const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('=== PRUEBA CON CLIENTE SUPABASE ===');
console.log('');

async function testSupabaseClient() {
  try {
    console.log('Variables de entorno:');
    console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
    console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '***CONFIGURADO***' : 'NO CONFIGURADO');
    console.log('');

    // Crear cliente Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    console.log('Probando conexión con cliente Supabase...');
    
    // Probar consulta simple
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error con cliente Supabase:', error);
      
      if (error.code === 'PGRST116') {
        console.log('La tabla "productos" no existe. Probando con información del schema...');
        
        // Listar tablas disponibles
        const { data: tables, error: tablesError } = await supabase
          .rpc('get_table_info', { schema_name: 'public' });
          
        if (tablesError) {
          console.error('Error obteniendo tablas:', tablesError);
        } else {
          console.log('Tablas encontradas:', tables);
        }
      }
      
    } else {
      console.log('¡Conexión exitosa con cliente Supabase!');
      console.log('Datos de prueba:', data);
      
      // Probar consulta a categorías
      console.log('\nProbando consulta a categorías...');
      const { data: categories, error: catError } = await supabase
        .from('categorias')
        .select('*')
        .limit(5);
        
      if (catError) {
        console.error('Error con categorías:', catError);
      } else {
        console.log('Categorías encontradas:', categories);
      }
    }

  } catch (error) {
    console.error('Error general:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n=== SOLUCIÓN: USAR API REST DIRECTA ===');
      console.log('El cliente no puede resolver DNS. Probando con fetch directo...');
      
      try {
        const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/categorias`, {
          headers: {
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('¡Conexión exitosa con API REST directa!');
          console.log('Categorías:', data);
        } else {
          console.error('Error en API REST:', response.status, response.statusText);
        }
      } catch (fetchError) {
        console.error('Error con fetch:', fetchError.message);
      }
    }
  }
}

testSupabaseClient();
