import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginFormComponent } from './login-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;
  let swalFireSpy: jasmine.Spy;

  beforeEach(async () => {
    // Crear mocks de AuthService y Router
    authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginFormComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Espiar Swal.fire
    swalFireSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false }));
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize the form with email and password controls', () => {
      expect(component.loginForm).toBeDefined();
      expect(component.loginForm.get('email')).toBeDefined();
      expect(component.loginForm.get('password')).toBeDefined();
    });
  });

  describe('Form Validation', () => {
    it('should invalidate the form when empty', () => {
      component.loginForm.patchValue({ email: '', password: '' });
      expect(component.loginForm.valid).toBeFalse();
    });

    it('should validate email format', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.valid).toBeFalse();

      emailControl?.setValue('valid@example.com');
      expect(emailControl?.valid).toBeTrue();
    });

    it('should require a minimum password length of 6 characters', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('12345');
      expect(passwordControl?.valid).toBeFalse();

      passwordControl?.setValue('123456');
      expect(passwordControl?.valid).toBeTrue();
    });
  });

  describe('Form Submission', () => {
    it('should not submit the form if it is invalid', () => {
      component.loginForm.patchValue({ email: '', password: '' });
      component.onSubmit();

      expect(authServiceMock.login).not.toHaveBeenCalled();
      expect(component.errorMessage).toBe('Por favor completa todos los campos correctamente.');
    });

    it('should call AuthService.login with correct parameters when form is valid', () => {
      const validCredentials = { email: 'test@example.com', password: 'password123' };
      authServiceMock.login.and.returnValue(of({}));

      component.loginForm.patchValue(validCredentials);
      component.onSubmit();

      expect(authServiceMock.login).toHaveBeenCalledWith(validCredentials.email, validCredentials.password);
    });

    it('should handle successful login', fakeAsync(() => {
      authServiceMock.login.and.returnValue(of({}));
      component.loginForm.patchValue({ email: 'test@example.com', password: 'password123' });

      component.onSubmit();

      expect(swalFireSpy).toHaveBeenCalledWith({
        title: '¡Inicio de sesión exitoso!',
        text: 'Bienvenido de nuevo.',
        icon: 'success',
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#ff2847',
      });

      // Simular la resolución del Promise de Swal.fire
      tick();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
    }));

    it('should handle login failure with 401 error', fakeAsync(() => {
      const errorResponse = { status: 401 };
      authServiceMock.login.and.returnValue(throwError(() => errorResponse));
      component.loginForm.patchValue({ email: 'test@example.com', password: 'wrongpassword' });

      component.onSubmit();

      expect(swalFireSpy).toHaveBeenCalledWith({
        title: 'Error de credenciales',
        text: 'Correo o contraseña incorrectos.',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo',
        confirmButtonColor: '#ff2847',
      });
    }));

    it('should handle login failure with unexpected error', fakeAsync(() => {
      const errorResponse = { status: 500 };
      authServiceMock.login.and.returnValue(throwError(() => errorResponse));
      component.loginForm.patchValue({ email: 'test@example.com', password: 'password123' });

      component.onSubmit();

      expect(swalFireSpy).toHaveBeenCalledWith({
        title: 'Error inesperado',
        text: 'Hubo un problema al iniciar sesión. Intenta nuevamente más tarde.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#ff2847',
      });
    }));
  });
});
