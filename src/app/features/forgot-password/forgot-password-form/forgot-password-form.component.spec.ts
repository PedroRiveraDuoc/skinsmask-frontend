import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordFormComponent } from './forgot-password-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

describe('ForgotPasswordFormComponent', () => {
  let component: ForgotPasswordFormComponent;
  let fixture: ComponentFixture<ForgotPasswordFormComponent>;
  let swalFireSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordFormComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordFormComponent);
    component = fixture.componentInstance;

    // Espiar Swal.fire para evitar que se muestren alertas reales
    swalFireSpy = spyOn(Swal, 'fire');

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize the form with empty values', () => {
      const emailControl = component.forgotPasswordForm.get('email');
      expect(emailControl?.value).toBe('');
    });

    it('should initialize the form with email control', () => {
      expect(component.forgotPasswordForm).toBeDefined();
      expect(component.forgotPasswordForm.get('email')).toBeDefined();
    });

    it('should have required and email validators on email control', () => {
      const emailControl = component.forgotPasswordForm.get('email');
      emailControl?.setValue('');
      expect(emailControl?.valid).toBeFalse();
      expect(emailControl?.errors?.['required']).toBeTrue();

      emailControl?.setValue('invalid-email');
      expect(emailControl?.valid).toBeFalse();
      expect(emailControl?.errors?.['email']).toBeTrue();

      emailControl?.setValue('test@example.com');
      expect(emailControl?.valid).toBeTrue();
    });
  });

  describe('Form Validation', () => {
    it('should invalidate the form when email is empty', () => {
      component.forgotPasswordForm.patchValue({ email: '' });
      expect(component.forgotPasswordForm.valid).toBeFalse();
    });

    it('should invalidate the form when email format is invalid', () => {
      component.forgotPasswordForm.patchValue({ email: 'invalid-email' });
      expect(component.forgotPasswordForm.valid).toBeFalse();
    });

    it('should validate the form when email format is valid', () => {
      component.forgotPasswordForm.patchValue({ email: 'test@example.com' });
      expect(component.forgotPasswordForm.valid).toBeTrue();
    });
  });

  describe('onSubmit', () => {
    it('should show error Swal when form is invalid', () => {
      component.forgotPasswordForm.patchValue({ email: '' });
      component.onSubmit();
      expect(swalFireSpy).toHaveBeenCalledWith({
        title: 'Error',
        text: 'Por favor, ingresa un correo electrónico válido.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#ff2847',
      });
    });

    it('should call simulatePasswordRecovery when form is valid', () => {
      spyOn(component, 'simulatePasswordRecovery');
      component.forgotPasswordForm.patchValue({ email: 'test@example.com' });
      component.onSubmit();
      expect(component.simulatePasswordRecovery).toHaveBeenCalledWith('test@example.com');
    });
  });

  describe('simulatePasswordRecovery', () => {
    it('should show success Swal when randomValue > 0.5', () => {
      spyOn(component, 'generateRandomValue').and.returnValue(0.6);
      component.simulatePasswordRecovery('test@example.com');

      expect(swalFireSpy).toHaveBeenCalledWith({
        title: '¡Éxito!',
        text: `Se ha enviado un enlace de recuperación a test@example.com.`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#ff2847',
      });
    });

    it('should show error Swal when randomValue <= 0.5', () => {
      spyOn(component, 'generateRandomValue').and.returnValue(0.4);
      component.simulatePasswordRecovery('test@example.com');

      expect(swalFireSpy).toHaveBeenCalledWith({
        title: 'Error',
        text: 'Hubo un problema al intentar enviar el enlace. Por favor, intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#ff2847',
      });
    });
  });

  describe('generateRandomValue', () => {
    it('should generate a random value between 0 and 1', () => {
      const randomValue = component.generateRandomValue();
      expect(randomValue).toBeGreaterThanOrEqual(0);
      expect(randomValue).toBeLessThan(1);
    });
  });
});

