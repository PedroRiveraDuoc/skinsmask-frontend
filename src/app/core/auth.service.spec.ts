import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const localStorageMock: { [key: string]: string | null } = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.callFake((key: string) => localStorageMock[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      localStorageMock[key] = value;
    });
    spyOn(localStorage, 'clear').and.callFake(() => {
      for (const key in localStorageMock) {
        delete localStorageMock[key];
      }
    });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#login', () => {
    it('should send a POST request to login and store the token', () => {
      const mockResponse = { token: 'mockToken123' };
      const mockEmail = 'test@example.com';
      const mockPassword = 'password123';

      service.login(mockEmail, mockPassword).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mockToken123');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: mockEmail, password: mockPassword });
      req.flush(mockResponse);

      service.isAuthenticated$.subscribe((isAuthenticated) => {
        expect(isAuthenticated).toBe(true);
      });

      service.username$.subscribe((username) => {
        expect(username).toBe(mockEmail);
      });
    });
  });

  describe('#logout', () => {
    it('should clear localStorage and reset subjects', () => {
      localStorageMock['token'] = 'mockToken';
      localStorageMock['email'] = 'mockuser@example.com';

      service.logout();

      expect(localStorage.clear).toHaveBeenCalled();
      service.isAuthenticated$.subscribe((isAuthenticated) => {
        expect(isAuthenticated).toBe(false);
      });
      service.username$.subscribe((username) => {
        expect(username).toBeNull();
      });
    });
  });

  describe('#getAuthenticatedUserData', () => {
    it('should return the decoded token payload', () => {
      const mockTokenPayload = { username: 'testuser', email: 'test@example.com' };
      const mockToken = `header.${btoa(JSON.stringify(mockTokenPayload))}.signature`;

      localStorageMock['token'] = mockToken;

      const userData = service.getAuthenticatedUserData();
      expect(userData).toEqual(mockTokenPayload);
    });

    it('should return null if token is invalid', () => {
      localStorageMock['token'] = 'invalidToken';

      const userData = service.getAuthenticatedUserData();
      expect(userData).toBeNull();
    });

    it('should return null if token is not present', () => {
      delete localStorageMock['token'];

      const userData = service.getAuthenticatedUserData();
      expect(userData).toBeNull();
    });
  });

  describe('Private methods', () => {
    it('#hasToken should return true if token exists in localStorage', () => {
      localStorageMock['token'] = 'mockToken';

      const hasToken = (service as any).hasToken();
      expect(hasToken).toBe(true);
    });

    it('#hasToken should return false if token does not exist in localStorage', () => {
      delete localStorageMock['token'];

      const hasToken = (service as any).hasToken();
      expect(hasToken).toBe(false);
    });

    it('#getEmail should return the email from localStorage', () => {
      localStorageMock['email'] = 'mockuser@example.com';

      const email = (service as any).getEmail();
      expect(email).toBe('mockuser@example.com');
    });

    it('#getEmail should return null if email is not present in localStorage', () => {
      delete localStorageMock['email'];

      const email = (service as any).getEmail();
      expect(email).toBeNull();
    });
  });
});
