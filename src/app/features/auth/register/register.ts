import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';
import { ERole } from '../../../core/models/user.model'; // Importe l'enum des rôles

// Validateur personnalisé pour vérifier que les mots de passe correspondent
export function passwordMismatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { mismatch: true }; // Erreur si les MDP ne correspondent pas
  }
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './register.html', 
  styleUrls: ['./register.css'] 
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  // Le type par défaut correspond à l'enum MAJUSCULE
  userType: ERole = ERole.BENEFICIARY; 
  
  profilePicFilename: string | null = null;
  verificationDocFilename: string | null = null;
  private profileImageFile: File | null = null;
  private verificationDocumentFile: File | null = null;

  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialise le formulaire
    this.registerForm = this.fb.group({
      // Champs de 'beneficiary'
      fullName: [''],
      // Champs de 'merchant' / 'association'
      orgName: [''],
      // 'regNumber' a été supprimé
      
      // Champs communs
      email: ['', [Validators.required, Validators.email]],
      location: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: passwordMismatchValidator }); 

    // Applique les validateurs pour le type par défaut
    this.switchType(ERole.BENEFICIARY);
  }

  /**
   * Change le type d'utilisateur et ajuste les validateurs du formulaire.
   */
  switchType(type: ERole | string) {
    this.userType = type as ERole;
    const fullNameControl = this.registerForm.get('fullName');
    const orgNameControl = this.registerForm.get('orgName');
    
    // 'regNumberControl' a été supprimé

    // Réinitialise tous les validateurs de nom/orga
    fullNameControl?.clearValidators();
    orgNameControl?.clearValidators();

    // Applique les validateurs requis en fonction du rôle
    if (this.userType === ERole.BENEFICIARY) {
      fullNameControl?.setValidators([Validators.required]);
    } else { // Merchant ou Association
      orgNameControl?.setValidators([Validators.required]);
    }

    // Met à jour la validité
    fullNameControl?.updateValueAndValidity();
    orgNameControl?.updateValueAndValidity();
  }

  /**
   * Stocke les fichiers lorsqu'ils sont sélectionnés
   */
  onFileChange(event: Event, fieldName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      if (fieldName === 'profilePic') {
        this.profilePicFilename = file.name;
        this.profileImageFile = file; // Stocke le fichier
      } else if (fieldName === 'verificationDoc') {
        this.verificationDocFilename = file.name;
        this.verificationDocumentFile = file; // Stocke le fichier
      }
    }
  }

  /**
   * (RDT-3) Construit le FormData et l'envoie au service
   */
  onSubmit() {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.registerForm.invalid) {
      this.errorMessage = "Veuillez corriger les erreurs dans le formulaire.";
      return;
    }
    
    // Fichiers requis pour Merchant/Association
    if (this.userType !== ERole.BENEFICIARY && (!this.profileImageFile || !this.verificationDocumentFile)) {
       this.errorMessage = "L'image de profil et le document de vérification sont requis.";
       return;
    }
    
    this.isLoading = true;
    const formData = new FormData();
    
    // Mappe les champs du formulaire vers les champs du backend [cite: Replate Backend (Simplifié)]
    if (this.userType === ERole.BENEFICIARY) {
      formData.append('name', this.registerForm.get('fullName')?.value);
    } else {
      formData.append('name', this.registerForm.get('orgName')?.value);
    }
    
    formData.append('email', this.registerForm.get('email')?.value);
    formData.append('password', this.registerForm.get('password')?.value);
    formData.append('phone', this.registerForm.get('phone')?.value);
    formData.append('address', this.registerForm.get('location')?.value);
    
    // 'userType' est en MAJUSCULES (ex: 'BENEFICIARY')
    // Le backend attend des minuscules (ex: 'beneficiary') [cite: bassemkallel/replate-backend/Replate-Backend-dev/src/main/java/com/replate/replatebackend/controller/AuthController.java]
    formData.append('role', this.userType.toLowerCase()); 

    if (this.profileImageFile) {
      formData.append('profileImage', this.profileImageFile);
    }
    if (this.verificationDocumentFile) {
      formData.append('verificationDocument', this.verificationDocumentFile);
    }

    // Appelle le service (qui attend du 'text') [cite: Service d'Authentification:src/app/core/services/auth.ts]
    this.authService.register(formData).subscribe({
      next: (responseString: string) => {
        this.isLoading = false;
        this.successMessage = responseString; // "Inscription réussie!..."
        setTimeout(() => {
          this.router.navigate(['/auth/login']); // Redirige vers le login
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erreur d\'inscription', err);
        // Affiche le message d'erreur du backend (ex: "Erreur: Rôle non supporté!")
        this.errorMessage = err.error || "Une erreur est survenue.";
      }
    });
  }
}