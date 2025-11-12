import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common'; // <-- Pipes
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Announcement } from '../../../core/models/announcement.model';
import { AnnouncementService } from '../../../core/services/announcement';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-announcement-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, TitleCasePipe], // <-- Pipes
  templateUrl: './announcement-detail.html',
  styleUrls: ['./announcement-detail.css']
})
export class AnnouncementDetailComponent implements OnInit {

  public announcement$: Observable<Announcement>;
  public baseUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private announcementService: AnnouncementService,
    private authService: AuthService
  ) {
    this.baseUrl = this.authService.getApiBaseUrl(); // Pour l'image
    this.announcement$ = this.announcementService.getAnnouncementById('0'); // Initialisation par défaut
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDetails(id);
    } else {
      // Gérer le cas où l'ID est manquant
      this.router.navigate(['/merchant/my-announcements']);
    }
  }

  loadDetails(id: string): void {
    this.announcement$ = this.announcementService.getAnnouncementById(id);
  }

  /**
   * (RDT-6) Navigue vers le formulaire en mode Édition
   */
  onEdit(id: number): void {
    // Navigue vers la nouvelle route /announcement-editor/:id
    this.router.navigate(['/merchant/announcement-editor', id]);
  }

  /**
   * (RDT-7) Supprime l'annonce
   */
  onDelete(id: number): void {
    if (confirm("Voulez-vous vraiment supprimer cette annonce ?")) {
      this.announcementService.deleteAnnouncement(id).subscribe({
        next: (response) => {
          console.log(response); // "Annonce supprimée avec succès"
          this.router.navigate(['/merchant/my-announcements']);
        },
        error: (err) => {
          console.error("Erreur lors de la suppression", err);
          alert("Une erreur est survenue lors de la suppression.");
        }
      });
    }
  }

  // TODO: Logique pour accepter/rejeter les offres
  onAccept(offer: any): void { alert('Logique d\'acceptation à implémenter.'); }
  onDecline(offer: any): void { alert('Logique de rejet à implémenter.'); }
}