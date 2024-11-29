import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private userApiUrl = `${environment.apiUrl}/api/users`; // Endpoint específico para acciones de usuario

  constructor(private http: HttpClient, private authService: AuthService) { }

  /**
   * Registra un nuevo usuario.
   * @param user Objeto con la información del usuario (username, password, email).
   * @returns Observable con la respuesta del backend.
   */
  register(user: { username: string; password: string; email: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene la información del usuario autenticado.
   * @param token Token JWT del usuario autenticado.
   * @returns Observable con los datos del usuario.
   */
  getAuthenticatedUser(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.userApiUrl}/me`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza el perfil del usuario autenticado.
   * @param profile Objeto con los datos actualizados del usuario (firstName, lastName, email).
   * @returns Observable con la respuesta del backend.
   */
  updateUserProfile(profile: { firstName: string; lastName: string; email: string }): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado. Usuario no autorizado.');
      return throwError(() => new Error('No autorizado. Inicia sesión nuevamente.'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    console.log('Actualizando perfil con los datos:', profile); // Log para depuración

    return this.http.put(`${this.userApiUrl}/update`, profile, { headers }).pipe(
      tap((response) => {
        console.log('Respuesta del servidor al actualizar perfil:', response);
        // Actualiza el estado del correo en AuthService
        this.authService.setUpdatedEmail(profile.email);
      }),
      catchError((error) => {
        console.error('Error al actualizar el perfil:', error);
        return this.handleError(error);
      })
    );
  }


  /**
   * Maneja errores de HTTP.
   * @param error Respuesta del error HTTP.
   * @returns Observable con el error.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error inesperado.';
    if (error.status === 400) {
      errorMessage = 'Solicitud inválida. Por favor, verifica los datos enviados.';
    } else if (error.status === 401) {
      errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
    } else if (error.status === 404) {
      errorMessage = 'Recurso no encontrado. Por favor, verifica la URL.';
    } else if (error.status === 500) {
      errorMessage = 'Error interno del servidor. Intenta nuevamente más tarde.';
    }
    return throwError(() => new Error(errorMessage));
  }
}
