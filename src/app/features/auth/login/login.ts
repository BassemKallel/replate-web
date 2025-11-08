import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: (user) => {
        this.isLoading = false;
        alert('Connexion réussie !');
        
        // Rediriger en fonction du rôle
        if (user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (user.role === 'merchant') {
          this.router.navigate(['/merchant']);
        } else {
          this.router.navigate(['/']); // Page par défaut
        }
      },
      error: (err) => {
        this.isLoading = false;
        alert(err.message || 'Une erreur est survenue');
      }
    });
  }
}