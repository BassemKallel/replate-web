import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Requis pour *ngFor
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Menu } from '../../core/services/menu';
import { AuthService } from '../../core/services/auth';
import { MenuItem } from '../../core/models/menuItem.model';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive], // CommonModule ajouté
  templateUrl: './sidenav.html',
  styleUrls: ['./sidenav.css'] // Pointeur vers le CSS
})
export class Sidenav implements OnInit {
  
  menuItems: MenuItem[] = [];
  
  // Gère l'état d'ouverture des sous-menus (si vous en ajoutez)
  openSubMenu: string | null = null; 

  constructor(
    private menuService: Menu, 
    private authService: AuthService // Pour le bouton Logout
  ) {}

  ngOnInit(): void {
    this.loadMenu();
  }

  loadMenu(): void {
    this.menuItems = this.menuService.getMenuItems();
  }

  // Gère les clics sur les menus (pour les sous-menus)
  toggleSubMenu(label: string) {
    if (this.openSubMenu === label) {
      this.openSubMenu = null;
    } else {
      this.openSubMenu = label;
    }
  }

  // Appelle le service de déconnexion
  logout(): void {
    this.authService.logout();
  }
}