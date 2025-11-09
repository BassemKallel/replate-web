import { Injectable } from '@angular/core';
import { AuthService } from './auth'; // <-- Importez AuthService
import { MenuItem } from '../models/menuItem.model'; 

@Injectable({
  providedIn: 'root',
})
export class Menu {

  constructor(private authService: AuthService) {} // <-- Injectez AuthService

  // Défini en s'inspirant du HTML de Code A
  private adminMenuItems: MenuItem[] = [
    { label: 'Overview', icon: 'fa-solid fa-chart-pie', link: '/admin/overview' },
    { 
      label: 'Users', 
      icon: 'fa-solid fa-users', 
      link: '#', // Lien parent
      children: [
        { label: 'All users', icon: '', link: '/admin/validate-accounts' },
        { label: 'Associations', icon: '', link: '/admin/associations' },
        { label: 'Merchants', icon: '', link: '/admin/merchants' },
      ]
    },
    { 
      label: 'Announcements', 
      icon: 'fa-solid fa-bullhorn', 
      link: '#',
      children: [
        { label: 'All Announcements', icon: '', link: '/admin/announcements' }
      ]
    }
  ];

  private merchantMenuItems: MenuItem[] = [
    { label: 'Overview', icon: 'fa-solid fa-chart-pie', link: '/merchant/overview' },
    { 
      label: 'Announcements', 
      icon: 'fa-solid fa-bullhorn', 
      link: '#',
      children: [
        { label: 'Create New', icon: '', link: '/merchant/announcement-form' },
        { label: 'All Announcements', icon: '', link: '/merchant/announcement-list' }
      ]
    },
    { label: 'Transactions', icon: 'fa-solid fa-credit-card', link: '/merchant/transactions' },
    { label: 'Impact', icon: 'fa-solid fa-leaf', link: '/merchant/impact' },
    { label: 'Reports', icon: 'fa-solid fa-file-lines', link: '/merchant/reports' },
  ];

  /**
   * Retourne la liste de menus en fonction du rôle de l'utilisateur.
   */
  getMenuItems(): MenuItem[] {
    // Obtenez le rôle actuel depuis votre service d'authentification.
    // Adaptez "getRole()" à la méthode réelle de votre AuthService.
    const role = this.authService.getCurrentUserRole(); // EXEMPLE

    if (role === 'ADMIN') {
      return this.adminMenuItems;
    } else if (role === 'MERCHANT') {
      return this.merchantMenuItems;
    }
    
    // Par défaut (ex: si non connecté ou rôle inconnu)
    // Vous pouvez choisir de retourner un menu vide ou le menu admin par défaut
    return this.adminMenuItems; // ou []
  }
}