import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

/**
 * Ce guard empêche les utilisateurs connectés d'accéder
 * aux pages publiques comme Login et Register.
 */
export const publicGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        // Si l'utilisateur est déjà connecté, on le redirige
        const role = authService.getCurrentUserRole();

        if (role === 'ADMIN') {
            router.navigate(['/admin/validate-accounts']);
        } else {
            router.navigate(['/merchant/my-announcements']);
        }

        return false; // Bloque la navigation vers Login/Register
    }

    // L'utilisateur n'est pas connecté, il peut voir Login/Register
    return true;
};