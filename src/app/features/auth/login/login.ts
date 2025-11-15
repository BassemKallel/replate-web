import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = "Email ou mot de passe invalide.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // Le service 'authService' (corrigé) s'occupe de :
    // 1. Appeler http://localhost:8080/api/users/login
    // 2. Gérer la réponse et la navigation
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        // La navigation est gérée dans le service
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login error', err);
        
        // CORRIGÉ : Affiche le message d'erreur venant du backend
        this.errorMessage = err.error?.message || err.error || "Email ou mot de passe incorrect.";
      }
    });
  }
}