import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';
import { FileService } from '../../../core/services/file';
import { ERole } from '../../../core/models/user.model';
// CORRECTION 1: Ajouter 'Observable' à l'import
import { finalize, switchMap, of, Observable } from 'rxjs';

// Validateur personnalisé pour vérifier que les mots de passe correspondent
export function passwordMismatchValidator(control: AbstractControl): ValidationErrors | null {
// ... (code inchangé) ...
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { mismatch: true }; // Erreur si les MDP ne correspondent pas
  }
  return null;
}

@Component({
// ... (code inchangé) ...
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register implements OnInit {
// ... (code inchangé) ...
  registerForm!: FormGroup;
  userType: ERole = ERole.BENEFICIARY;
  verificationDocFilename: string | null = null;
  private verificationDocumentFile: File | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
// ... (code inchangé) ...
    private fb: FormBuilder,
    private authService: AuthService,
    private fileService: FileService,
    private router: Router
  ) { }

  ngOnInit(): void {
// ... (code inchangé) ...
    this.registerForm = this.fb.group({
      fullName: [''], // Pour 'BENEFICIARY'
      orgName: [''], // Pour 'MERCHANT' / 'ASSOCIATION'
      email: ['', [Validators.required, Validators.email]],
      location: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: passwordMismatchValidator });

    this.switchType(ERole.BENEFICIARY);
  }

  /**
   * Change le type d'utilisateur et ajuste les validateurs du formulaire.
   */
  switchType(type: ERole | string) {
// ... (code inchangé) ...
    this.userType = type as ERole;
    const fullNameControl = this.registerForm.get('fullName');
    const orgNameControl = this.registerForm.get('orgName');

    fullNameControl?.clearValidators();
    orgNameControl?.clearValidators();

    if (this.userType === ERole.BENEFICIARY) {
      fullNameControl?.setValidators([Validators.required]);
    } else { // Merchant ou Association
      orgNameControl?.setValidators([Validators.required]);
    }

    fullNameControl?.updateValueAndValidity();
    orgNameControl?.updateValueAndValidity();
  }

  /**
   * Stocke les fichiers lorsqu'ils sont sélectionnés
   */
  onFileChange(event: Event, fieldName: string): void {
// ... (code inchangé) ...
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // Ne gère que 'verificationDoc'
      if (fieldName === 'verificationDoc') {
        this.verificationDocFilename = file.name;
        this.verificationDocumentFile = file;
      }
    }
  }

  /**
   * CORRIGÉ : Logique d'envoi en 2 étapes (Upload puis Register)
   */
  onSubmit() {
// ... (code inchangé) ...
    this.errorMessage = null;
    this.successMessage = null;

    if (this.registerForm.invalid) {
      this.errorMessage = "Veuillez corriger les erreurs dans le formulaire.";
      return;
    }

    if (this.userType !== ERole.BENEFICIARY && !this.verificationDocumentFile) {
      this.errorMessage = "Le document de vérification est requis.";
      return;
    }

    this.isLoading = true;

    // CORRECTION 2: Déclarer le type explicite pour 'uploadObservable'
    let uploadObservable: Observable<string | null>;

    // Étape 1: Uploader le fichier (seulement si ce n'est pas un 'BENEFICIARY')
    if (this.userType !== ERole.BENEFICIARY && this.verificationDocumentFile) {
      uploadObservable = this.fileService.upload(this.verificationDocumentFile);
    } else {
      uploadObservable = of(null); // 'of(null)' crée un observable qui émet 'null' immédiatement
    }

    uploadObservable.pipe(
      switchMap((fileUrl: string | null) => {
        
        const registerPayload = {
          email: this.registerForm.get('email')?.value,
          password: this.registerForm.get('password')?.value,
          role: this.userType,
          username: this.userType === ERole.BENEFICIARY
            ? this.registerForm.get('fullName')?.value
            : this.registerForm.get('orgName')?.value,
          phoneNumber: this.registerForm.get('phone')?.value,
          location: this.registerForm.get('location')?.value,
          documentUrl: fileUrl // Sera 'null' pour 'BENEFICIARY'
        };

        return this.authService.register(registerPayload);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({ 
      next: (responseString: string) => {
        this.successMessage = responseString; // Ex: "User registered successfully!"
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (err: any) => {
        console.error('Erreur d\'inscription', err);
        this.errorMessage = err.error?.message || err.error || "Une erreur est survenue.";
      }
    });
  }
}