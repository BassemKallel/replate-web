import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap, map } from 'rxjs';
import { User } from '../models/user.model'; // Assurez-vous que ce modèle n'a plus 'profileImageUrl'
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // CORRIGÉ : Doit pointer vers la Gateway (8080), pas le service (8081)
  // C'est ce qui corrige votre erreur CORS.
  private baseUrl = 'http://localhost:8080/api';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.loadUserFromStorage();
  }

  /**
   * Connexion
   * CORRIGÉ : S'adapte à AuthResponse.java et aux endpoints du UserController.java
   */
  login(credentials: { email: string, password: string }): Observable<any> {
    // CORRIGÉ : L'endpoint est /users/login, pas /auth/signin
    return this.http.post<any>(`${this.baseUrl}/users/login`, credentials)
      .pipe(
        tap(response => {
          // 'response' est votre 'AuthResponse' du backend
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role); 
          
          const user: User = {
            id: response.id,
            username: response.username, // CORRIGÉ : 'username' dans le backend
            email: response.email,
            role: response.role,
            location: response.location, // CORRIGÉ : 'location' dans le backend
            phoneNumber: response.phoneNumber, // CORRIGÉ : 'phoneNumber' dans le backend
            isValidated: response.isValidated, // CORRIGÉ : 'isValidated' dans le backend
            status: response.isValidated ? 'Approved' : 'Pending',
            
            // Champs non présents dans AuthResponse (donc supprimés ou mis par défaut)
            verificationDocumentUrl: '', // Ce n'est pas dans AuthResponse
            createdAt: new Date().toISOString(),
          };

          this.currentUserSubject.next(user);

          // Redirection basée sur le rôle
          if (response.role === 'ADMIN') {
            this.router.navigate(['/admin/validate-accounts']);
          } else {
            this.router.navigate(['/merchant/my-announcements']);
          }
        })
      );
  }

  /**
   * Inscription
   * CORRIGÉ : Accepte un objet JSON (RegisterRequest), pas FormData.
   * C'est pour correspondre à @RequestBody dans votre UserController
   */
  register(data: any): Observable<string> { 
    // CORRIGÉ : L'endpoint est /users/register
    return this.http.post(
      `${this.baseUrl}/users/register`, 
      data, // Envoie l'objet JSON
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
   * CORRIGÉ : Endpoint du AdminController.java
   */
  getUsersForValidation(): Observable<User[]> {
    // CORRIGÉ : L'endpoint est /admin/pending-users
    return this.http.get<User[]>(`${this.baseUrl}/admin/pending-users`).pipe(
      map(users => users.map(user => ({
        ...user,
        // Mappage des champs du backend (User.java) vers le frontend (user.model.ts)
        username: user.username,
        location: user.location,
        phoneNumber: user.phoneNumber,
        isValidated: user.isValidated,
        verificationDocumentUrl: (user as any).documentUrl || '', // Pour Merchant/Association
        status: user.isValidated ? 'Approved' : 'Pending',
        createdAt: new Date().toISOString(), // Ajout d'une valeur par défaut
      } as User)))
    );
  }

  /**
   * Valide un utilisateur.
   * CORRIGÉ : Endpoint du AdminController.java
   */
  approveUser(id: number): Observable<User> {
    // CORRIGÉ : L'endpoint est /admin/validate-user/{id}
    return this.http.put<User>(`${this.baseUrl}/admin/validate-user/${id}`, {}).pipe(
      map(user => ({
        ...user,
        status: user.isValidated ? 'Approved' : 'Pending'
      } as User))
    );
  }

  /**
   * Rejette un utilisateur.
   * CORRIGÉ : Remplacement de la simulation par l'appel réel
   */
  rejectUser(id: number): Observable<any> {
    // CORRIGÉ : L'endpoint est /admin/reject-user/{id}
    return this.http.delete<any>(`${this.baseUrl}/admin/reject-user/${id}`);
  }
  
  /**
   * Charge l'utilisateur depuis localStorage (simplifié)
   */
  private loadUserFromStorage(): void {
    const token = this.getToken();
    if (token) {
      // Dans une application réelle, on devrait ici faire un appel /me
      // pour récupérer les infos. Pour l'instant, on met un placeholder.
      const role = this.getCurrentUserRole();
      
      this.currentUserSubject.next({
        id: 0, 
        username: 'Utilisateur',
        email: '...',
        role: role || 'Unknown',
        status: 'Approved',
        location: '',
        phoneNumber: '',
        verificationDocumentUrl: '',
        createdAt: new Date().toISOString(),
        isValidated: true
      });
    }
  }
}