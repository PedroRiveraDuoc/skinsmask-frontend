import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService, UserProfile } from './user.service';
import { AuthService } from './auth.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  const apiUrl = 'http://localhost:8081/api/auth'; // Ajustar al puerto 8081
  const userApiUrl = 'http://localhost:8081/api/users';

  beforeEach(() => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['setUpdatedEmail']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#register', () => {
    it('should send a POST request to register a user', () => {
      const mockUser: UserProfile = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john.doe@example.com',
        password: 'password123',
        roles: ['user'],
      };

      service.register(mockUser).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/signup`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockUser);
      req.flush({ message: 'User registered successfully' });
    });

    it('should handle an error response', () => {
      const mockUser: UserProfile = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john.doe@example.com',
        password: 'password123',
        roles: ['user'],
      };

      service.register(mockUser).subscribe({
        error: (error) => {
          expect(error.message).toBe('Solicitud inválida. Verifica los datos enviados.');
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/signup`);
      req.flush({ message: 'Invalid request' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('#updateUserProfile', () => {
    it('should send a PUT request to update the user profile', () => {
      const mockToken = 'mockToken123';
      const mockProfile: Partial<UserProfile> = { email: 'updated.email@example.com' };
      const mockResponse = { message: 'Profile updated successfully' };

      spyOn(localStorage, 'getItem').and.returnValue(mockToken);

      service.updateUserProfile(mockProfile).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(authServiceSpy.setUpdatedEmail).toHaveBeenCalledWith('updated.email@example.com');
      });

      const req = httpMock.expectOne(`${userApiUrl}/update`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      expect(req.request.body).toEqual(mockProfile);
      req.flush(mockResponse);
    });

    it('should handle an error response when updating the profile', () => {
      const mockToken = 'mockToken123';
      const mockProfile: Partial<UserProfile> = { email: 'updated.email@example.com' };

      spyOn(localStorage, 'getItem').and.returnValue(mockToken);

      service.updateUserProfile(mockProfile).subscribe({
        error: (error) => {
          expect(error.message).toBe('Solicitud inválida. Verifica los datos enviados.');
        },
      });

      const req = httpMock.expectOne(`${userApiUrl}/update`);
      req.flush({ message: 'Invalid request' }, { status: 400, statusText: 'Bad Request' });
    });
  });
});
