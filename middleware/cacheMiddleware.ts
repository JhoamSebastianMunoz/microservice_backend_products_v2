import { Request, Response, NextFunction } from 'express';

interface CacheEntry {
    data: any;
    timestamp: number;
    ttl: number;
}

class MemoryCache {
    private cache: Map<string, CacheEntry> = new Map();
    private defaultTTL: number = 5 * 60 * 1000; // 5 minutos por defecto

    set(key: string, data: any, ttl?: number): void {
        const entry: CacheEntry = {
            data,
            timestamp: Date.now(),
            ttl: ttl || this.defaultTTL
        };
        this.cache.set(key, entry);
    }

    get(key: string): any | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    // Limpiar entradas expiradas
    cleanup(): void {
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

export const cacheMiddleware = (ttl?: number) => {
    return (req: Request, res: Response, next: NextFunction) => {
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
        res.json = function(data: any) {
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

export const invalidateCache = (pattern: string): void => {
    for (const key of (cache as any).cache.keys()) {
        if (typeof key === 'string' && key.includes(pattern)) {
            cache.delete(key);
        }
    }
};

export const clearCache = (): void => {
    cache.clear();
};

function generateCacheKey(req: Request): string {
    const url = req.originalUrl || req.url;
    const query = JSON.stringify(req.query);
    const headers = JSON.stringify({
        'user-agent': req.get('user-agent'),
        'accept': req.get('accept')
    });
    
    return `${req.method}:${url}:${query}:${headers}`;
}

// Middleware para invalidar caché después de operaciones de escritura
export const cacheInvalidationMiddleware = (patterns: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const originalSend = res.send;
        
        res.send = function(data: any) {
            // Invalidar caché si la operación fue exitosa
            if (res.statusCode >= 200 && res.statusCode < 300) {
                patterns.forEach(pattern => invalidateCache(pattern));
            }
            return originalSend.call(this, data);
        };
        
        next();
    };
};
