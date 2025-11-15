import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  
  // L'URL de la Gateway pointant vers le file-service
  // (Basé sur FileController.java et gateway application.properties)
  private baseUrl = 'http://localhost:8080/api/files';

  constructor(private http: HttpClient) { }

  /**
   * Uploade un fichier vers le 'file-service'
   * L'endpoint du backend est /upload (selon FileController.java)
   * Il retourne l'URL du fichier en tant que 'text'
   */
  upload(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post(`${this.baseUrl}/upload`, formData, { responseType: 'text' });
  }
}