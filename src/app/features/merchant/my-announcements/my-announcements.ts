import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common'; // <-- Pipes
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Announcement } from '../../../core/models/announcement.model';
import { AnnouncementService } from '../../../core/services/announcement';
import { AuthService } from '../../../core/services/auth'; // <-- Pour l'URL de base

@Component({
  selector: 'app-my-announcements',
  standalone: true,
  imports: [CommonModule, TitleCasePipe], // <-- Pipes
  templateUrl: './my-announcements.html',
  styleUrls: ['./my-announcements.css']
})
export class MyAnnouncementsComponent implements OnInit {

  public announcements$: Observable<Announcement[]>;
  public baseUrl: string; // Pour les images

  constructor(
    private announcementService: AnnouncementService,
    private authService: AuthService,
    private router: Router
  ) {
    this.baseUrl = this.authService.getApiBaseUrl();
    this.announcements$ = this.announcementService.getMerchantAnnouncements();
  }

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  loadAnnouncements(): void {
    this.announcements$ = this.announcementService.getMerchantAnnouncements();
  }

  /**
   * Navigue vers la page de détail (RDT-6 / RDT-7)
   */
  navigateToDetail(id: number): void {
    this.router.navigate(['/merchant/announcement-detail', id]);
  }

  /**
   * Navigue vers la page de création (RDT-5)
   */
  navigateToCreate(): void {
    this.router.navigate(['/merchant/announcement-editor']);
  }
}