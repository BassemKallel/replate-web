import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // L'URL de votre mock server (de l'ancien projet)
  private API_URL = 'https://my-json-server.typicode.com/BassemKallel/replate-mock-server';

  // BehaviorSubject pour stocker l'utilisateur (null si déconnecté)
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  public getCurrentUserRole(): string | null {
    return this.currentUserValue ? this.currentUserValue.role : null;
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  private loadUserFromStorage() {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      this.currentUserSubject.next(JSON.parse(userJson));
    }
  }

  /**
   * Tâche RDT-71: Se connecter
   */
  login(email: string, password: string): Observable<User> {
    return this.http.get<User[]>(`${this.API_URL}/users?email=${email}`).pipe(
      map(users => {
        if (users.length === 0 || users[0].password !== password) {
          throw new Error('Email ou mot de passe incorrect');
        }
        const user = users[0];
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }),
      catchError(err => throwError(() => err))
    );
  }

  /**
   * Tâche RDT-3: Créer un compte
   */
  register(userData: any): Observable<User> {
    // Le mock server simulera un POST et renverra les données
    return this.http.post<User>(`${this.API_URL}/users`, userData).pipe(
      tap(() => {
        if (userData.role === 'association' || userData.role === 'merchant'){
          alert('Votre compte a été créé avec succès ! Veuillez attendre la vérification de votre document avant de vous connecter.');
        }
        else{
          alert('Votre compte a été créé avec succès ! Vous pouvez vous connecter.');
        }
        this.router.navigate(['/auth/login']);
      })
    );
  }

  /**
   * Déconnexion
   */
  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }
}