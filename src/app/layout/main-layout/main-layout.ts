import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Sidenav } from '../sidenav/sidenav';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    Header,
    Sidenav
  ],
  templateUrl: './main-layout.html',
  styleUrls: [] // Nous ajouterons le CSS à l'étape 3
})
export class MainLayoutComponent {
}