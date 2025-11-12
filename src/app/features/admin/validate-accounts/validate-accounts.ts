import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-validate-accounts',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './validate-accounts.html',
  styleUrls: ['./validate-accounts.css']
})
export class ValidateAccounts implements OnInit {

  pendingUsers: User[] = [];
  approvedUsers: User[] = [];
  rejectedUsers: User[] = [];

  // État de la boîte de dialogue (amélioré)
  isDialogOpen = false;
  selectedDocumentUrl: string | null = null;
  selectedDocumentName: string | null = null;
  isDocumentImage = false; // <-- NOUVEAU: pour gérer l'aperçu

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.authService.getUsersForValidation().subscribe(users => {
      this.pendingUsers = users;
    });
  }

  handleApprove(userToApprove: User): void {
    this.authService.approveUser(userToApprove.id).subscribe(approvedUser => {
      this.pendingUsers = this.pendingUsers.filter(u => u.id !== userToApprove.id);
      this.approvedUsers.push({ ...userToApprove, ...approvedUser });
    });
  }

  handleReject(userToReject: User): void {
    this.authService.rejectUser(userToReject.id).subscribe(() => {
      this.pendingUsers = this.pendingUsers.filter(u => u.id !== userToReject.id);
      this.rejectedUsers.push({ ...userToReject, status: 'Rejected' });
    });
  }

  // --- LOGIQUE DE DIALOGUE AMÉLIORÉE ---

  /**
   * Ouvre la boîte de dialogue pour voir un document.
   * CORRIGÉ : Accepte l'utilisateur et le type de document pour construire la bonne URL.
   */
  openDocument(user: User, docType: 'profile' | 'verification') {
    let filename: string | undefined;
    let path: string;

    if (docType === 'profile') {
      filename = user.profileImageUrl;
      path = 'users'; // [cite: bassemkallel/replate-backend/Replate-Backend-dev/src/main/java/com/replate/replatebackend/controller/FileController.java]
      this.selectedDocumentName = "Photo de profil";
    } else {
      filename = user.verificationDocumentUrl;
      path = 'verification'; // [cite: bassemkallel/replate-backend/Replate-Backend-dev/src/main/java/com/replate/replatebackend/controller/FileController.java]
      this.selectedDocumentName = "Document de vérification";
    }

    if (filename) {
      // Construit l'URL complète et correcte
      this.selectedDocumentUrl = `${this.authService.getApiBaseUrl()}/files/${path}/${filename}`;
      // Vérifie si c'est une image pour l'aperçu
      this.isDocumentImage = this.isImageUrl(filename);
      this.isDialogOpen = true;
    }
  }

  /**
   * Ferme la boîte de dialogue
   */
  closeDialog() {
    this.isDialogOpen = false;
    this.selectedDocumentUrl = null;
    this.selectedDocumentName = null;
    this.isDocumentImage = false;
  }

  // --- NOUVELLES FONCTIONS HELPERS ---

  /**
   * Vérifie si un nom de fichier est une image (pour l'aperçu)
   */
  isImageUrl(filename: string): boolean {
    return /\.(jpe?g|png|gif)$/i.test(filename);
  }

  /**
   * Retourne la classe d'icône Font Awesome basée sur l'extension du fichier
   */
  getFileIcon(filename: string | undefined): string {
    if (!filename) {
      return 'fa-solid fa-file-circle-question text-gray-400';
    }
    if (/\.(jpe?g|png)$/i.test(filename)) {
      return 'fa-solid fa-file-image text-blue-500';
    }
    if (/\.(pdf)$/i.test(filename)) {
      return 'fa-solid fa-file-pdf text-red-500';
    }
    if (/\.(doc|docx)$/i.test(filename)) {
      return 'fa-solid fa-file-word text-blue-700';
    }
    return 'fa-solid fa-file-lines text-gray-500';
  }
}