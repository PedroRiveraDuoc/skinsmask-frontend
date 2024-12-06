import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface UserProfile {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private userApiUrl = `${environment.apiUrl}/api/users`; // Endpoint específico para acciones de usuario

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Registra un nuevo usuario.
   */
  register(user: UserProfile): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user).pipe(
      catchError((error) => {
        console.error('Error en el registro:', error);
        return this.handleError(error);
      })
    );
  }

  /**
   * Obtiene la información del usuario autenticado.
   */
  getAuthenticatedUser(token: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get('/api/users/me', { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al obtener el perfil del usuario:', error);
        return throwError(() => new Error(error.message || 'Error desconocido.'));
      })
    );
  }

  /**
   * Actualiza el perfil del usuario autenticado.
   */
  updateUserProfile(profile: Partial<UserProfile>): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado. Usuario no autorizado.');
      return throwError(() => new Error('No autorizado. Inicia sesión nuevamente.'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.userApiUrl}/update`, profile, { headers }).pipe(
      tap((response) => {
        console.log('Perfil actualizado exitosamente:', response);
        if (profile.email) this.authService.setUpdatedEmail(profile.email);
      }),
      catchError((error) => {
        console.error('Error al actualizar el perfil:', error);
        return this.handleError(error);
      })
    );
  }

  /**
   * Maneja errores de HTTP.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error inesperado.';
    if (error.status === 400) {
      errorMessage = 'Solicitud inválida. Verifica los datos enviados.';
    } else if (error.status === 401) {
      errorMessage = 'No autorizado. Inicia sesión nuevamente.';
    } else if (error.status === 404) {
      errorMessage = 'Recurso no encontrado.';
    } else if (error.status === 500) {
      errorMessage = 'Error interno del servidor.';
    }
    return throwError(() => new Error(errorMessage));
  }
}
