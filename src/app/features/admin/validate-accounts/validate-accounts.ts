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

  isDialogOpen = false;
  selectedDocumentUrl: string | null = null;
  selectedDocumentName: string | null = null;
  isDocumentImage = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.authService.getUsersForValidation().subscribe((users: User[]) => {
      this.pendingUsers = users;
    });
  }

  handleApprove(userToApprove: User): void {
    this.authService.approveUser(userToApprove.id).subscribe(() => {
      this.pendingUsers = this.pendingUsers.filter(u => u.id !== userToApprove.id);
      this.approvedUsers.push({ ...userToApprove, status: 'Approved', isValidated: true });
    });
  }

  handleReject(userToReject: User): void {
    this.authService.rejectUser(userToReject.id).subscribe(() => {
      this.pendingUsers = this.pendingUsers.filter(u => u.id !== userToReject.id);
      this.rejectedUsers.push({ ...userToReject, status: 'Rejected' });
    });
  }


  /**
   * CORRIGÉ: N'accepte plus 'docType', seulement 'user'.
   * Le service authService a déjà mappé 'documentUrl' en 'verificationDocumentUrl'
   */
  openDocument(user: User) {
    let filename = user.verificationDocumentUrl;
    this.selectedDocumentName = "Document de vérification";

    if (filename) {
      // 'filename' est l'URL complète
      this.selectedDocumentUrl = filename; 
      this.isDocumentImage = this.isImageUrl(filename);
      this.isDialogOpen = true;
    } else {
      console.error("Aucun documentUrl trouvé pour cet utilisateur.");
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

  /**
   * Vérifie si un nom de fichier est une image (pour l'aperçu)
   */
  isImageUrl(filename: string): boolean {
    return /\.(jpe?g|png|gif)$/i.test(filename);
  }

  /**
   * Retourne la classe d'icône Font Awesome
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