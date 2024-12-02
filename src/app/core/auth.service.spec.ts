import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let store: { [key: string]: string } = {};
  const environment = {
    apiUrl: 'http://localhost:8081', // Adjust based on your actual API URL
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

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
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request when login is called', () => {
    const mockEmail = 'test@example.com';
    const mockPassword = '123456';
    const mockResponse = { token: 'abc123' };

    service.login(mockEmail, mockPassword).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: mockEmail, password: mockPassword });

    req.flush(mockResponse);
  });

  it('should update localStorage and observables when login is successful', () => {
    const mockEmail = 'test@example.com';
    const mockPassword = '123456';
    const mockResponse = { token: 'abc123' };

    let isAuthenticatedValue: boolean | undefined;
    let usernameValue: string | null | undefined;

    service.isAuthenticated$.subscribe((value) => {
      isAuthenticatedValue = value;
    });

    service.username$.subscribe((value) => {
      usernameValue = value;
    });

    service.login(mockEmail, mockPassword).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/login`);
    req.flush(mockResponse);

    expect(localStorage.setItem).toHaveBeenCalledWith('token', mockResponse.token);
    expect(localStorage.setItem).toHaveBeenCalledWith('email', mockEmail);
    expect(isAuthenticatedValue).toBeTrue();
    expect(usernameValue).toBe(mockEmail);
  });

  it('should clear localStorage and update observables when logout is called', () => {
    // Set initial state
    store['token'] = 'abc123';
    store['email'] = 'test@example.com';
    service.login('test@example.com', 'password123').subscribe();

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('email')).toBeNull();

    service.isAuthenticated$.subscribe((isAuthenticated) => {
      expect(isAuthenticated).toBeFalse();
    });

    service.username$.subscribe((username) => {
      expect(username).toBeNull();
    });
  });

  it('should update and retrieve the updated email', () => {
    const newEmail = 'newemail@example.com';

    service.setUpdatedEmail(newEmail);

    expect(localStorage.setItem).toHaveBeenCalledWith('email', newEmail);
    expect(service.getUpdatedEmail()).toBe(newEmail);

    service.username$.subscribe((username) => {
      expect(username).toBe(newEmail);
    });
  });

  // Add more tests as needed to cover all methods and scenarios
});
