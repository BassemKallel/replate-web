import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Announcement } from '../models/announcement.model';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  
  private baseUrl: string;
  private announcementsUrl: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { 
    // Initialise les URLs dans le constructeur
    this.baseUrl = this.authService.getApiBaseUrl();
    this.announcementsUrl = `${this.baseUrl}/announcements`;
  }

  /**
   * (RDT-5) Crée une nouvelle annonce.
   * POST /api/announcements
   */
  createAnnouncement(formData: FormData): Observable<string> {
    // Le backend attend FormData et répond avec du texte
    // [cite: bassemkallel/replate-backend/Replate-Backend-dev/src/main/java/com/replate/replatebackend/controller/AnnouncementController.java]
    return this.http.post(`${this.announcementsUrl}`, formData, { responseType: 'text' });
  }

  /**
   * (RDT-6) Met à jour une annonce existante.
   * PUT /api/announcements/{id}
   */
  updateAnnouncement(id: string, formData: FormData): Observable<string> {
    // Le backend attend FormData et répond avec du texte
    // [cite: bassemkallel/replate-backend/Replate-Backend-dev/src/main/java/com/replate/replatebackend/controller/AnnouncementController.java]
    return this.http.put(`${this.announcementsUrl}/${id}`, formData, { responseType: 'text' });
  }

  /**
   * (RDT-7) Supprime une annonce.
   * DELETE /api/announcements/{id}
   */
  deleteAnnouncement(id: number): Observable<string> {
    // Le backend répond avec du texte
    // [cite: bassemkallel/replate-backend/Replate-Backend-dev/src/main/java/com/replate/replatebackend/controller/AnnouncementController.java]
    return this.http.delete(`${this.announcementsUrl}/${id}`, { responseType: 'text' });
  }

  /**
   * Récupère toutes les annonces du Merchant connecté.
   * GET /api/announcements/merchant
   * [cite: bassemkallel/replate-backend/Replate-Backend-dev/src/main/java/com/replate/replatebackend/controller/AnnouncementController.java]
   */
  getMerchantAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${this.announcementsUrl}/merchant`);
  }

  /**
   * Récupère une annonce par son ID.
   * GET /api/announcements/{id}
   * [cite: bassemkallel/replate-backend/Replate-Backend-dev/src/main/java/com/replate/replatebackend/controller/AnnouncementController.java]
   */
  getAnnouncementById(id: string): Observable<Announcement> {
    return this.http.get<Announcement>(`${this.announcementsUrl}/${id}`);
  }
}