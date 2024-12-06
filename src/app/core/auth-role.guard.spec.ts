import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthRoleGuard } from './auth-role.guard';
import { AuthService } from './auth.service';
import { provideRouter } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('AuthRoleGuard', () => {
  let guard: AuthRoleGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['getAuthenticatedUserData']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        AuthRoleGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    guard = TestBed.inject(AuthRoleGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('debería permitir acceso si el usuario tiene el rol requerido', () => {
    // Configura datos simulados
    const mockUser = { roles: ['admin', 'user'] };
    authServiceSpy.getAuthenticatedUserData.and.returnValue(mockUser);

    const route = {
      data: { roles: ['admin'] },
    } as unknown as ActivatedRouteSnapshot;

    const state = {} as RouterStateSnapshot;

    // Verifica que se permita el acceso
    const result = guard.canActivate(route, state);
    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('debería denegar acceso y redirigir si el usuario no tiene el rol requerido', () => {
    // Configura datos simulados
    const mockUser = { roles: ['user'] };
    authServiceSpy.getAuthenticatedUserData.and.returnValue(mockUser);

    const route = {
      data: { roles: ['admin'] },
    } as unknown as ActivatedRouteSnapshot;

    const state = {} as RouterStateSnapshot;

    // Verifica que se deniegue el acceso
    const result = guard.canActivate(route, state);
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });

  it('debería denegar acceso y redirigir si no hay usuario autenticado', () => {
    // Configura datos simulados
    authServiceSpy.getAuthenticatedUserData.and.returnValue(null);

    const route = {
      data: { roles: ['admin'] },
    } as unknown as ActivatedRouteSnapshot;

    const state = {} as RouterStateSnapshot;

    // Verifica que se deniegue el acceso
    const result = guard.canActivate(route, state);
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });

  it('debería denegar acceso si los roles del usuario están vacíos', () => {
    // Configura datos simulados
    const mockUser = { roles: [] };
    authServiceSpy.getAuthenticatedUserData.and.returnValue(mockUser);

    const route = {
      data: { roles: ['admin'] },
    } as unknown as ActivatedRouteSnapshot;

    const state = {} as RouterStateSnapshot;

    // Verifica que se deniegue el acceso
    const result = guard.canActivate(route, state);
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });
});
