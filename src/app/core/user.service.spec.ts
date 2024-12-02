import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';

describe('UserService', () => {
  let service: UserService;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let httpMock: HttpTestingController;
  let store: { [key: string]: string } = {};

  beforeEach(() => {
    // Crear un mock de AuthService
    authServiceMock = jasmine.createSpyObj('AuthService', ['setUpdatedEmail']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);

    // Mock de localStorage
    store = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string): string | null => {
      return store[key] || null;
    });
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): void => {
      store[key] = value;
    });
    spyOn(localStorage, 'removeItem').and.callFake((key: string): void => {
      delete store[key];
    });
    spyOn(localStorage, 'clear').and.callFake(() => {
      store = {};
    });
  });

  afterEach(() => {
    httpMock.verify();
    store = {};
  });

  describe('register', () => {
    it('should send POST request to the correct URL with user data', () => {
      const mockUser = { username: 'testuser', password: 'password123', email: 'test@example.com' };
      const mockResponse = { success: true };

      service.register(mockUser).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/signup`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockUser);

      req.flush(mockResponse);
    });

    it('should handle error response', () => {
      const mockUser = { username: 'testuser', password: 'password123', email: 'test@example.com' };
      const errorMessage = 'Solicitud inválida. Por favor, verifica los datos enviados.';

      service.register(mockUser).subscribe({
        next: () => fail('Expected an error, but got a response'),
        error: (error) => {
          expect(error.message).toBe(errorMessage);
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/signup`);
      expect(req.request.method).toBe('POST');

      req.flush({}, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getAuthenticatedUser', () => {
    it('should send GET request to the correct URL with Authorization header', () => {
      const token = 'abc123';
      const mockUser = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };

      service.getAuthenticatedUser(token).subscribe((user) => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/users/me`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);

      req.flush(mockUser);
    });

    it('should handle error response', () => {
      const token = 'abc123';
      const errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';

      service.getAuthenticatedUser(token).subscribe({
        next: () => fail('Expected an error, but got a response'),
        error: (error) => {
          expect(error.message).toBe(errorMessage);
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/users/me`);
      expect(req.request.method).toBe('GET');

      req.flush({}, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('updateUserProfile', () => {
    it('should throw error if token is not found in localStorage', () => {
      store['token'] = ''; // Simular que no hay token

      service.updateUserProfile({ firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' }).subscribe({
        next: () => fail('Expected an error, but got a response'),
        error: (error) => {
          expect(error.message).toBe('No autorizado. Inicia sesión nuevamente.');
        },
      });

      // No se espera ninguna solicitud HTTP
      httpMock.expectNone(`${environment.apiUrl}/api/users/update`);
    });

    it('should send PUT request to the correct URL with profile data and Authorization header', () => {
      store['token'] = 'abc123';
      const updatedProfile = { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' };

      service.updateUserProfile(updatedProfile).subscribe((response) => {
        expect(response).toEqual(updatedProfile);
        expect(authServiceMock.setUpdatedEmail).toHaveBeenCalledWith(updatedProfile.email);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/users/update`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer abc123`);
      expect(req.request.body).toEqual(updatedProfile);

      req.flush(updatedProfile);
    });

    it('should handle error response', () => {
      store['token'] = 'abc123';
      const updatedProfile = { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' };
      const errorMessage = 'Error interno del servidor. Intenta nuevamente más tarde.';

      service.updateUserProfile(updatedProfile).subscribe({
        next: () => fail('Expected an error, but got a response'),
        error: (error) => {
          expect(error.message).toBe(errorMessage);
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/users/update`);
      expect(req.request.method).toBe('PUT');

      req.flush({}, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('handleError', () => {
    it('should return appropriate error message based on status code', () => {
      const error400 = new HttpErrorResponse({ status: 400, statusText: 'Bad Request' });
      const error401 = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
      const error404 = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
      const error500 = new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });
      const errorUnknown = new HttpErrorResponse({ status: 0, statusText: 'Unknown Error' });

      // Usaremos una función auxiliar para probar el método privado
      // Aunque no es una práctica común, es útil para aumentar la cobertura

      // @ts-ignore: Accessing private method for testing purposes
      const handleError = service['handleError'].bind(service);

      handleError(error400).subscribe({
        next: () => fail('Expected an error'),
        error: (error) => {
          expect(error.message).toBe('Solicitud inválida. Por favor, verifica los datos enviados.');
        },
      });

      handleError(error401).subscribe({
        next: () => fail('Expected an error'),
        error: (error) => {
          expect(error.message).toBe('No autorizado. Por favor, inicia sesión nuevamente.');
        },
      });

      handleError(error404).subscribe({
        next: () => fail('Expected an error'),
        error: (error) => {
          expect(error.message).toBe('Recurso no encontrado. Por favor, verifica la URL.');
        },
      });

      handleError(error500).subscribe({
        next: () => fail('Expected an error'),
        error: (error) => {
          expect(error.message).toBe('Error interno del servidor. Intenta nuevamente más tarde.');
        },
      });

      handleError(errorUnknown).subscribe({
        next: () => fail('Expected an error'),
        error: (error) => {
          expect(error.message).toBe('Ocurrió un error inesperado.');
        },
      });
    });
  });
});
