import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap, map } from 'rxjs'; // <-- 'map' ajouté
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8081/api';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.loadUserFromStorage();
  }

  /**
   * Helper pour construire les URL de fichiers
   */
  public getApiBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * (RDT-71) Connexion - Mis à jour pour le modèle User complet
   */
  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/signin`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role); 
          
          const user: User = {
            id: response.id,
            name: response.name,
            email: response.email,
            role: response.role,
            status: 'Approved',
            // Ajout des nouveaux champs depuis JwtResponse
            address: response.address || '', 
            phone: response.phone || '',
            profileImageUrl: response.profileImageUrl || '',
            verificationDocumentUrl: response.verificationDocumentUrl || '',
            createdAt: response.createdAt || new Date().toISOString(),
            verified: response.verified || true
          };

          this.currentUserSubject.next(user);

          if (response.role === 'ADMIN') {
            this.router.navigate(['/admin/validate-accounts']);
          } else {
            this.router.navigate(['/merchant/my-announcements']); // <-- Corrigé (my-announcements)
          }
        })
      );
  }

  /**
   * (RDT-3) Inscription
   */
  register(formData: FormData): Observable<string> { 
    return this.http.post(
      `${this.baseUrl}/auth/signup`, 
      formData, 
      { responseType: 'text' } 
    );
  }

  /**
   * Déconnexion
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.currentUserSubject.next(null);
    // CORRECTION : Redirige vers la bonne route de login
    this.router.navigate(['/auth/login']);
  }

  // --- Méthodes pour les Guards ---

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUserRole(): string | null {
    return localStorage.getItem('role');
  }
  
  // --- Méthodes pour RDT-4 (Validate Accounts) ---

  /**
   * Récupère les utilisateurs en attente.
   * CORRIGÉ : Mappe 'verified' en 'status'
   */
  getUsersForValidation(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/admin/users/pending`).pipe(
      map(users => users.map(user => ({
        ...user,
        // Mappe le boolean du backend en string pour l'UI
        status: user.verified ? 'Approved' : 'Pending'
      } as User)))
    );
  }

  /**
   * Valide un utilisateur.
   * CORRIGÉ : Mappe 'verified' en 'status'
   */
  approveUser(id: number): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/admin/users/validate/${id}`, {}).pipe(
      map(user => ({
        ...user,
        // Mappe la réponse du backend
        status: user.verified ? 'Approved' : 'Pending'
      } as User))
    );
  }

  /**
   * Rejette un utilisateur. (Simulation)
   */
  rejectUser(id: number): Observable<any> {
    console.warn('Simulation de rejet : Endpoint non trouvé dans le backend.');
    return of(null); 
  }
  
  /**
   * Charge l'utilisateur depuis localStorage (Mis à jour)
   */
  private loadUserFromStorage(): void {
    const token = this.getToken();
    if (token) {
      const role = this.getCurrentUserRole();
      
      this.currentUserSubject.next({
        id: 0, 
        name: 'Utilisateur',
        email: '...',
        role: role || 'Unknown',
        status: 'Approved',
        // Ajout des nouveaux champs
        address: '',
        phone: '',
        profileImageUrl: '',
        verificationDocumentUrl: '',
        createdAt: new Date().toISOString(),
        verified: true
      });
    }
  }
}