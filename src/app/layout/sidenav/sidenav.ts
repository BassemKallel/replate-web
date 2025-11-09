import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Menu } from '../../core/services/menu';
import { AuthService } from '../../core/services/auth'; 
import { MenuItem } from '../../core/models/menuItem.model';
@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [ CommonModule, RouterLink, RouterLinkActive ],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css'
})
export class Sidenav implements OnInit {
  
  menuItems: MenuItem[] = [];
  isAnnouncementsOpen = false;
  // isSidebarHovered = false; // <-- SUPPRIMÉ

  constructor(
    private menuService: Menu, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadMenu();
  }

  loadMenu(): void {
    this.menuItems = this.menuService.getMenuItems();
  }

  toggleAnnouncementsMenu() {
    this.isAnnouncementsOpen = !this.isAnnouncementsOpen;
  }

  // onSidebarHover(hovered: boolean) { ... } // <-- SUPPRIMÉ
}