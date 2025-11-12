import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();

    // Ne pas attacher le token pour le login ou le register
    if (req.url.includes('/api/auth/signin') || req.url.includes('/api/auth/signup')) {
        return next(req);
    }

    if (token) {
        // Clone la requête et ajoute le header d'autorisation
        const cloned = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(cloned);
    }

    return next(req);
};