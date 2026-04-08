import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Falta la configuración de SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env");
}

// Crear instancia del cliente de Supabase
const supabaseClient: SupabaseClient = createClient(supabaseUrl, supabaseServiceKey);

export default supabaseClient;
