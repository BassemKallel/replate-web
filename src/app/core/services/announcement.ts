import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Announcement } from '../models/announcement.model';
// import { AuthService } from './auth'; // SUPPRIMÉ

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

  // CORRIGÉ: 'baseUrl' est défini directement
  // Il n'y a plus de dépendance à AuthService
  private baseUrl = 'http://localhost:8080/api/announcements';

  constructor(
    private http: HttpClient
    // private authService: AuthService // SUPPRIMÉ
  ) {
    // La ligne this.baseUrl = ... a été supprimée
  }

  // ... (le reste du service est correct) ...

  getMyAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${this.baseUrl}/my-announcements`);
  }

  deleteAnnouncement(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getAnnouncementById(id: string): Observable<Announcement> {
    return this.http.get<Announcement>(`${this.baseUrl}/${id}`);
  }

  getAllAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(this.baseUrl);
  }

  createAnnouncement(data: any): Observable<Announcement> {
    return this.http.post<Announcement>(this.baseUrl, data);
  }

  updateAnnouncement(id: string, data: any): Observable<Announcement> {
    return this.http.put<Announcement>(`${this.baseUrl}/${id}`, data);
  }
}