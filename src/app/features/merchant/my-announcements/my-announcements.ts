import { Component, OnInit } from '@angular/core';
import { AnnouncementService } from '../../../core/services/announcement';
import { Announcement } from '../../../core/models/announcement.model';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // CORRIGÉ: Importe Router
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-my-announcements',
  standalone: true,
  // CORRIGÉ: Les imports sont maintenant utilisés
  imports: [CommonModule, DatePipe, RouterLink, ConfirmDialog, StatusBadge],
  templateUrl: './my-announcements.html',
  styleUrls: ['./my-announcements.css']
})
export class MyAnnouncements implements OnInit {
  announcements: Announcement[] = [];
  
  showDeleteConfirm = false;
  selectedAnnouncementId: string | null = null;

  constructor(
    private announcementService: AnnouncementService,
    private router: Router // CORRIGÉ: Injecte Router
  ) {}

  ngOnInit(): void {
    this.loadAnnouncements();
  }
  
  loadAnnouncements(): void {
    this.announcementService.getMyAnnouncements().subscribe(data => {
      this.announcements = data;
    });
  }

  // CORRIGÉ: Ajout de la fonction de navigation
  navigateToCreate(): void {
    this.router.navigate(['/merchant/create']);
  }

  // CORRIGÉ: Ajout de la fonction de navigation
  navigateToDetail(id: string): void {
    this.router.navigate(['/merchant/announcement', id]);
  }

  // CORRIGÉ: Ajout d'un helper pour l'image
  getImageUrl(path: string | undefined): string {
    if (!path) {
      return 'assets/images/replate-bg.png'; // Image par défaut
    }
    // 'path' est déjà une URL complète du FileService
    return path;
  }

  // Gère l'ouverture de la confirmation
  requestDelete(id: string): void {
    this.selectedAnnouncementId = id;
    this.showDeleteConfirm = true;
  }

  // Gère la fermeture de la boîte de dialogue
  handleDeleteConfirm(confirmed: boolean): void {
    if (confirmed && this.selectedAnnouncementId) {
      this.announcementService.deleteAnnouncement(this.selectedAnnouncementId).subscribe(() => {
        this.loadAnnouncements(); // Recharge la liste
      });
    }
    this.showDeleteConfirm = false;
    this.selectedAnnouncementId = null;
  }
}