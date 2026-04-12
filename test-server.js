const express = require('express');
const cors = require('cors');
const supabaseClient = require('./config/config-supabaseStorage').default;

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba para productos
app.get('/test-get-products', async (req, res) => {
  try {
    console.log('Probando conexión a Supabase...');
    const { data, error } = await supabaseClient
      .from('productos')
      .select(`
        *,
        categorias(nombre_categoria)
      `);
    
    if (error) {
      console.error('Error de Supabase:', error);
      return res.status(500).json({ error: error.message });
    }
    
    console.log('Productos encontrados:', data?.length || 0);
    res.json(data);
  } catch (error) {
    console.error('Error general:', error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta de prueba para categorías
app.get('/test-get-categories', async (req, res) => {
  try {
    const { data, error } = await supabaseClient
      .from('categorias')
      .select('*');
    
    if (error) {
      console.error('Error de Supabase:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error general:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 10103;
app.listen(PORT, () => {
  console.log(`Servidor de prueba corriendo en puerto ${PORT}`);
  console.log(`Prueba productos: http://localhost:${PORT}/test-get-products`);
  console.log(`Prueba categorías: http://localhost:${PORT}/test-get-categories`);
});
