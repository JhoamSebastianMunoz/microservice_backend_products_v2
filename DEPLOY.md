# Guía de Despliegue Vercel - Pasos Manuales

## Resumen de Cambios Aplicados

Archivos creados/modificados:
- `app.ts` - Modificado para exportar `app` y solo ejecutar servidor en desarrollo
- `api/index.ts` - Creado como handler para Vercel Serverless
- `vercel.json` - Creado con configuración del runtime

---

## Pasos a Ejecutar Manualmente

### 1. Build Local de Prueba

```bash
npm run build
```

Verificar que se cree la carpeta `dist/` sin errores.

### 2. Login en Vercel CLI

```bash
vercel login
```

### 3. Inicializar Proyecto

```bash
vercel
```

Configuración:
- **Scope**: Tu cuenta personal
- **Link to existing project?**: `n`
- **Project name**: `microservice-backend-products` (o tu preferido)
- **Directory**: `./`

### 4. Configurar Variables de Entorno

Ir al [Dashboard de Vercel](https://vercel.com/dashboard) → Tu proyecto → Settings → Environment Variables

Añadir todas estas variables (valores de tu archivo `.env`):

| Variable | Entorno |
|----------|---------|
| `DATABASE_URL` | Production |
| `DB_HOST` | Production |
| `DB_PORT` | Production |
| `DB_DATABASE` | Production |
| `DB_USERNAME` | Production |
| `DB_PASSWORD` | Production |
| `DB_SSL` | Production (valor: `true`) |
| `SUPABASE_URL` | Production |
| `SUPABASE_ANON_KEY` | Production |
| `SUPABASE_SERVICE_ROLE_KEY` | Production |
| `SUPABASE_STORAGE_BUCKET` | Production |
| `NODE_ENV` | Production (valor: `production`) |

### 5. Deploy a Producción

```bash
vercel --prod
```

### 6. Actualizar CORS con Dominio Real

Después del deploy, Vercel te dará una URL como `https://microservice-backend-products-xxx.vercel.app`.

Editar `app.ts` y reemplazar:
```typescript
// TODO: Añadir dominio de Vercel después del primer deploy
// Ejemplo: 'https://tu-proyecto.vercel.app'
```

Con:
```typescript
'https://microservice-backend-products-xxx.vercel.app'
```

Hacer commit y redeploy:
```bash
vercel --prod
```

### 7. Verificación

```bash
# Health check
curl https://tu-proyecto.vercel.app/

# API endpoints
curl https://tu-proyecto.vercel.app/api/v2/products
curl https://tu-proyecto.vercel.app/api/v2/categories

# Swagger UI
# Abrir en navegador: https://tu-proyecto.vercel.app/api-docs
```

---

## Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `vercel` | Deploy preview |
| `vercel --prod` | Deploy producción |
| `vercel logs --tail` | Ver logs en tiempo real |
| `vercel env ls` | Listar variables de entorno |

---

## Troubleshooting

| Problema | Solución |
|----------|----------|
| 404 Cannot GET / | Verificar `vercel.json` y rutas |
| 502 Bad Gateway | Revisar que `api/index.ts` exporte `app` |
| CORS errors | Añadir dominio Vercel a `allowedOrigins` en `app.ts` |
| DB connection error | Verificar variables de entorno en dashboard |

---

**Estado**: Código listo para despliegue ✅
**Siguiente paso**: Ejecutar los comandos de la sección "Pasos a Ejecutar Manualmente" arriba.
