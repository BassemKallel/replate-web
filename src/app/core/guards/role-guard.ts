import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Rôle requis, défini dans app.routes.ts
  const requiredRole = route.data['role'];

  // 2. Rôle actuel de l'utilisateur
  const currentUserRole = authService.getCurrentUserRole();

  // 3. Vérification
  if (currentUserRole === requiredRole) {
    return true; // Le rôle correspond, accès autorisé
  }

  // Le rôle ne correspond pas
  console.error("Accès non autorisé : rôle requis", requiredRole, ", rôle actuel", currentUserRole);
  router.navigate(['/login']); // Redirige vers le login
  return false;
};