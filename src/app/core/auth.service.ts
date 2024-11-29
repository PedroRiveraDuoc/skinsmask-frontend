import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private usernameSubject = new BehaviorSubject<string | null>(this.getEmail());
  username$ = this.usernameSubject.asObservable();

  private userEmail: string | null = null; // Para manejar el correo actualizado

  constructor(private http: HttpClient) {}

  /**
   * Inicia sesión en la aplicación.
   * @param email Correo del usuario.
   * @param password Contraseña del usuario.
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/auth/login`, { email, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('email', email); // Guarda el correo electrónico como identificador principal
        this.isAuthenticatedSubject.next(true);
        this.usernameSubject.next(email); // Actualiza el observable con el correo
        this.userEmail = email; // Establece el correo actualizado
      })
    );
  }

  /**
   * Cierra sesión eliminando los datos del localStorage.
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.isAuthenticatedSubject.next(false);
    this.usernameSubject.next(null);
    this.userEmail = null; // Limpia el correo actualizado
  }

  /**
   * Verifica si hay un token almacenado.
   * @returns boolean
   */
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  /**
   * Obtiene el correo electrónico almacenado.
   * @returns string | null
   */
  private getEmail(): string | null {
    return localStorage.getItem('email');
  }

  /**
   * Establece el correo electrónico actualizado del usuario.
   * @param email El nuevo correo electrónico del usuario.
   */
  setUpdatedEmail(email: string): void {
    this.userEmail = email; // Establece el correo electrónico actualizado
    localStorage.setItem('email', email); // Actualiza en localStorage
    this.usernameSubject.next(email); // Actualiza el observable
  }

  /**
   * Obtiene el correo electrónico actualizado del usuario.
   * @returns El correo electrónico del usuario.
   */
  getUpdatedEmail(): string | null {
    return this.userEmail;
  }
}
