import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterFormComponent } from './register-form.component';
import { UserService } from '../../../core/user.service';
import { of, throwError } from 'rxjs';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let userServiceMock: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userServiceMock = jasmine.createSpyObj('UserService', ['register']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RegisterFormComponent],
      providers: [{ provide: UserService, useValue: userServiceMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Form initialization', () => {
    it('should initialize the form with empty controls', () => {
      const form = component.registerForm;
      expect(form).toBeDefined();
      expect(form.get('firstName')?.value).toBe('');
      expect(form.get('lastName')?.value).toBe('');
      expect(form.get('email')?.value).toBe('');
      expect(form.get('password')?.value).toBe('');
      expect(form.get('confirmPassword')?.value).toBe('');
    });

    it('should mark the form as invalid initially', () => {
      expect(component.registerForm.valid).toBeFalse();
    });
  });

  describe('Form validation', () => {
    it('should invalidate the form when fields are empty', () => {
      component.registerForm.patchValue({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      expect(component.registerForm.valid).toBeFalse();
    });

    it('should validate email format', () => {
      const emailControl = component.registerForm.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.valid).toBeFalse();

      emailControl?.setValue('valid@example.com');
      expect(emailControl?.valid).toBeTrue();
    });

    it('should invalidate password if it is less than 6 characters', () => {
      const passwordControl = component.registerForm.get('password');
      passwordControl?.setValue('12345');
      expect(passwordControl?.valid).toBeFalse();

      passwordControl?.setValue('123456');
      expect(passwordControl?.valid).toBeTrue();
    });

    it('should invalidate the form when passwords do not match', () => {
      component.registerForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: '123456',
        confirmPassword: '654321',
      });
      component.registerForm.updateValueAndValidity(); // Actualiza la validación

      // Verificar si el error está en el control confirmPassword
      const confirmPasswordErrors = component.registerForm.get('confirmPassword')?.errors;
      expect(confirmPasswordErrors).toBeTruthy();
      expect(confirmPasswordErrors?.['passwordsDoNotMatch']).toBeTrue();

      // El formulario también debería ser inválido
      expect(component.registerForm.valid).toBeFalse();
    });

    it('should validate the form when passwords match', () => {
      component.registerForm.patchValue({
        password: '123456',
        confirmPassword: '123456',
      });
      expect(component.registerForm.errors).toBeNull();
    });
  });

  describe('Form submission', () => {
    it('should not call userService.register if the form is invalid', () => {
      component.registerForm.patchValue({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      component.onSubmit();

      expect(userServiceMock.register).not.toHaveBeenCalled();
      expect(component.errorMessage).toBe('Por favor, completa todos los campos correctamente.');
    });

    it('should call userService.register when form is valid', () => {
      const validFormData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: '123456',
        confirmPassword: '123456',
      };

      userServiceMock.register.and.returnValue(of({ success: true }));
      component.registerForm.patchValue(validFormData);
      component.onSubmit();

      expect(userServiceMock.register).toHaveBeenCalledWith({
        username: 'John Doe',
        email: validFormData.email,
        password: validFormData.password,
      });
    });

    it('should show success message when registration is successful', () => {
      userServiceMock.register.and.returnValue(of({ success: true }));
      component.registerForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: '123456',
        confirmPassword: '123456',
      });

      component.onSubmit();

      expect(component.successMessage).toBe('Registro exitoso. ¡Ahora puedes iniciar sesión!');
      expect(component.errorMessage).toBe('');
    });

    it('should show error message when registration fails', () => {
      userServiceMock.register.and.returnValue(throwError(() => new Error('Registration failed')));
      component.registerForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: '123456',
        confirmPassword: '123456',
      });

      component.onSubmit();

      expect(component.errorMessage).toBe('Hubo un error al registrarte. Inténtalo de nuevo.');
      expect(component.successMessage).toBe('');
    });
  });
});
