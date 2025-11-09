import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Importez CommonModule
import { Observable } from 'rxjs'; // <-- Importez Observable
import { AuthService } from '../../core/services/auth'; // <-- Importez votre AuthService
import { User } from '../../core/models/user.model'; // <-- Importez votre modèle User

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule], // <-- Ajoutez CommonModule ici
  templateUrl: './header.html',
  styleUrls: []
})
export class Header {

  public currentUser$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

}