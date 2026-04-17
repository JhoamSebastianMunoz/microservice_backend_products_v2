"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Falta la configuración de SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env");
}
// Crear instancia del cliente de Supabase
const supabaseClient = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey);
exports.default = supabaseClient;
