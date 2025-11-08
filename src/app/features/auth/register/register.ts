import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { UserRole } from '../../../core/models/user.model'; // Importez votre modèle

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  userType: UserRole = 'beneficiary'; 
  isLoading = false;
  
  // Noms des fichiers pour l'aperçu
  profilePicFilename: string | null = null;
  verificationDocFilename: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      // Individual (beneficiary)
      fullName: [''],
      // Association & Merchant
      orgName: [''],
      regNumber: [''],
      // Commun
      email: ['', [Validators.required, Validators.email]],
      location: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      // Pour les fichiers
      profilePic: [null],
      verificationDoc: [null]
    }, { validators: this.passwordMatchValidator });

    // Appliquer les validateurs par défaut au démarrage
    this.switchType(this.userType);
  }

  // Validateur personnalisé pour vérifier que les mots de passe correspondent
  passwordMatchValidator(control: AbstractControl) {
    return control.get('password')?.value === control.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  // Changement de type d'utilisateur (maintenant 3 types)
  switchType(type: UserRole) {
    this.userType = type;
    
    // Réinitialiser les validateurs
    this.registerForm.get('fullName')?.clearValidators();
    this.registerForm.get('orgName')?.clearValidators();
    this.registerForm.get('regNumber')?.clearValidators();

    // Appliquer les validateurs pour le type sélectionné
    if (type === 'beneficiary') { // 'Individual'
      this.registerForm.get('fullName')?.setValidators([Validators.required]);
    } else if (type === 'association' || type === 'merchant') {
      this.registerForm.get('orgName')?.setValidators([Validators.required]);
      this.registerForm.get('regNumber')?.setValidators([Validators.required]);
    }

    // Mettre à jour la validité des champs
    this.registerForm.get('fullName')?.updateValueAndValidity();
    this.registerForm.get('orgName')?.updateValueAndValidity();
    this.registerForm.get('regNumber')?.updateValueAndValidity();
  }

  // Gère la sélection d'un fichier
  onFileChange(event: any, fieldName: 'profilePic' | 'verificationDoc') {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.registerForm.patchValue({ [fieldName]: file });
      if (fieldName === 'profilePic') {
        this.profilePicFilename = file.name;
      } else {
        this.verificationDocFilename = file.name;
      }
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    
    const formData = this.registerForm.value;
    
    // Note: Pour un vrai backend, vous utiliseriez FormData ici
    // pour envoyer les fichiers. Pour le mock server, nous n'envoyons que les noms.
    
    const userData = {
      name: (this.userType === 'beneficiary') ? formData.fullName : formData.orgName,
      email: formData.email,
      password: formData.password,
      location: formData.location,
      phone: formData.phone,
      role: this.userType,
      status: 'pending', // RDT-4: Tous les comptes sont en attente de validation
      ...(this.userType !== 'beneficiary' && { regNumber: formData.regNumber })
    };

    this.authService.register(userData).subscribe({
      next: () => {
        this.isLoading = false;
        // L'alerte et la redirection sont gérées dans le service
      },
      error: (err) => {
        this.isLoading = false;
        alert('Erreur lors de l\'inscription. Veuillez réessayer.');
        console.error(err);
      }
    });
  }
}