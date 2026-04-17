"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheInvalidationMiddleware = exports.clearCache = exports.invalidateCache = exports.cacheMiddleware = void 0;
class MemoryCache {
    constructor() {
        this.cache = new Map();
        this.defaultTTL = 5 * 60 * 1000; // 5 minutos por defecto
    }
    set(key, data, ttl) {
        const entry = {
            data,
            timestamp: Date.now(),
            ttl: ttl || this.defaultTTL
        };
        this.cache.set(key, entry);
    }
    get(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return null;
        if (Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }
        return entry.data;
    }
    delete(key) {
        this.cache.delete(key);
    }
    clear() {
        this.cache.clear();
    }
    // Limpiar entradas expiradas
    cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > entry.ttl) {
                this.cache.delete(key);
            }
        }
    }
}
const cache = new MemoryCache();
// Limpiar caché cada 10 minutos
setInterval(() => cache.cleanup(), 10 * 60 * 1000);
const cacheMiddleware = (ttl) => {
    return (req, res, next) => {
        // Solo cachear peticiones GET
        if (req.method !== 'GET') {
            return next();
        }
        const key = generateCacheKey(req);
        const cachedData = cache.get(key);
        if (cachedData) {
            res.set('X-Cache', 'HIT');
            return res.json(cachedData);
        }
        // Interceptar el método res.json para cachear la respuesta
        const originalJson = res.json;
        res.json = function (data) {
            // Solo cachear respuestas exitosas
            if (res.statusCode >= 200 && res.statusCode < 300) {
                cache.set(key, data, ttl);
            }
            res.set('X-Cache', 'MISS');
            return originalJson.call(this, data);
        };
        next();
    };
};
exports.cacheMiddleware = cacheMiddleware;
const invalidateCache = (pattern) => {
    for (const key of cache.cache.keys()) {
        if (typeof key === 'string' && key.includes(pattern)) {
            cache.delete(key);
        }
    }
};
exports.invalidateCache = invalidateCache;
const clearCache = () => {
    cache.clear();
};
exports.clearCache = clearCache;
function generateCacheKey(req) {
    const url = req.originalUrl || req.url;
    const query = JSON.stringify(req.query);
    const headers = JSON.stringify({
        'user-agent': req.get('user-agent'),
        'accept': req.get('accept')
    });
    return `${req.method}:${url}:${query}:${headers}`;
}
// Middleware para invalidar caché después de operaciones de escritura
const cacheInvalidationMiddleware = (patterns) => {
    return (req, res, next) => {
        const originalSend = res.send;
        res.send = function (data) {
            // Invalidar caché si la operación fue exitosa
            if (res.statusCode >= 200 && res.statusCode < 300) {
                patterns.forEach(pattern => (0, exports.invalidateCache)(pattern));
            }
            return originalSend.call(this, data);
        };
        next();
    };
};
exports.cacheInvalidationMiddleware = cacheInvalidationMiddleware;
