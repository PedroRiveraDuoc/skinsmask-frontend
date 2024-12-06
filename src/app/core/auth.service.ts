import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private emailSubject = new BehaviorSubject<string | null>(this.getEmail());
  private usernameSubject = new BehaviorSubject<string | null>(this.getEmail());
  username$ = this.usernameSubject.asObservable();

  constructor(private http: HttpClient) {}

  setUpdatedEmail(email: string): void {
    this.emailSubject.next(email);
  }


  login(email: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/auth/login`, { email, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        this.isAuthenticatedSubject.next(true);
        this.usernameSubject.next(email);
      })
    );
  }

  logout(): void {
    localStorage.clear();
    this.isAuthenticatedSubject.next(false);
    this.usernameSubject.next(null);
  }

  getAuthenticatedUserData(): any {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private getEmail(): string | null {
    return localStorage.getItem('email');
  }
}
