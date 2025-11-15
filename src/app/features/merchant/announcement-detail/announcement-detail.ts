import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // CORRIGÉ: Importe Router
import { AnnouncementService } from '../../../core/services/announcement';
import { Announcement } from '../../../core/models/announcement.model';
import { CommonModule, DatePipe } from '@angular/common';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog'; // CORRIGÉ: Importe ConfirmDialog

@Component({
  selector: 'app-announcement-detail',
  standalone: true,
  // CORRIGÉ: Ajoute ConfirmDialog
  imports: [CommonModule, DatePipe, StatusBadge, ConfirmDialog],
  templateUrl: './announcement-detail.html',
  styleUrls: ['./announcement-detail.css']
})
export class AnnouncementDetail implements OnInit {
  announcement: Announcement | null = null;
  
  // CORRIGÉ: Ajout de la logique de dialogue
  showDeleteConfirm = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router, // CORRIGÉ: Injecte Router
    private announcementService: AnnouncementService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.announcementService.getAnnouncementById(id).subscribe(data => {
        this.announcement = data;
      });
    }
  }

  // CORRIGÉ: Ajout de la fonction 'onEdit'
  onEdit(id: string): void {
    this.router.navigate(['/merchant/edit', id]);
  }

  // CORRIGÉ: Ajout de la logique 'onDelete'
  requestDelete(): void {
    this.showDeleteConfirm = true;
  }

  handleDeleteConfirm(confirmed: boolean): void {
    if (confirmed && this.announcement) {
      this.announcementService.deleteAnnouncement(this.announcement.id).subscribe(() => {
        this.router.navigate(['/merchant/my-announcements']); // Redirige après suppression
      });
    }
    this.showDeleteConfirm = false;
  }

  // Helper pour l'affichage de l'image
  getImageUrl(path: string | undefined): string {
    if (!path) {
      return 'assets/images/replate-bg.png'; // Image par défaut
    }
    // 'path' est déjà une URL complète
    return path;
  }
}