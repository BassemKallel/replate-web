import { Injectable } from '@angular/core';
import { AuthService } from './auth'; // Importé
import { MenuItem } from '../models/menuItem.model';
@Injectable({
  providedIn: 'root',
})
export class Menu {

  constructor(private authService: AuthService) { } // Injecté

  // Listes de menus basées sur le design de "Code A"
  // [cite: belgaiedaziz/replate-web-sp1/replate-web-sp1-f474f4bbbeadb80d5da2cec7ca8b680da4927b81/src/app/layout/sidenav/sidenav.component.html]

  private adminMenuItems: MenuItem[] = [
    { label: 'Validation Comptes', icon: 'fa-solid fa-user-check', link: '/admin/validate-accounts' },
    // (Ajoutez d'autres routes admin ici, ex: /admin/donations)
  ];

  private merchantMenuItems: MenuItem[] = [
    { label: 'Mes Annonces', icon: 'fa-solid fa-bullhorn', link: '/merchant/my-announcements' },
    { label: 'Créer Annonce', icon: 'fa-solid fa-plus', link: '/merchant/announcement-editor' },
    // (Ajoutez d'autres routes merchant ici, ex: /merchant/profile)
  ];

  /**
   * Retourne la liste de menus en fonction du rôle de l'utilisateur.
   */
  getMenuItems(): MenuItem[] {
    const role = this.authService.getCurrentUserRole(); // 'ADMIN' ou 'MERCHANT'

    if (role === 'ADMIN') {
      return this.adminMenuItems;
    } else if (role === 'MERCHANT' || role === 'ASSOCIATION') {
      return this.merchantMenuItems;
    }

    return []; // Retourne un menu vide si non connecté ou rôle inconnu
  }
}