import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactComponent } from './contact-form.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and initialize the form', () => {
    expect(component).toBeTruthy();
    expect(component.contactForm).toBeTruthy();
    expect(component.contactForm.controls['name']).toBeTruthy();
    expect(component.contactForm.controls['email']).toBeTruthy();
    expect(component.contactForm.controls['message']).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should have required validators on all fields', () => {
      const nameControl = component.contactForm.get('name');
      const emailControl = component.contactForm.get('email');
      const messageControl = component.contactForm.get('message');

      nameControl?.setValue('');
      emailControl?.setValue('');
      messageControl?.setValue('');

      expect(nameControl?.valid).toBeFalse();
      expect(emailControl?.valid).toBeFalse();
      expect(messageControl?.valid).toBeFalse();

      expect(nameControl?.errors).toEqual({ required: true });
      expect(emailControl?.errors).toEqual({ required: true });
      expect(messageControl?.errors).toEqual({ required: true });
    });

    it('should validate email format', () => {
      const emailControl = component.contactForm.get('email');

      // Caso 1: Email inválido
      emailControl?.setValue('invalidEmail');
      expect(emailControl?.valid).toBeFalse();
      expect(emailControl?.errors).toEqual({ email: true }); // Solo el error de formato está presente

      // Caso 2: Email válido
      emailControl?.setValue('valid@example.com');
      expect(emailControl?.valid).toBeTrue();
      expect(emailControl?.errors).toBeNull();
    });
  });

  describe('onSubmit', () => {
    it('should not submit if the form is invalid', () => {
      spyOn(window, 'alert');
      component.onSubmit();
      expect(window.alert).not.toHaveBeenCalled();
    });

    it('should submit and reset the form if valid', () => {
      spyOn(window, 'alert');
      spyOn(component.contactForm, 'reset');

      component.contactForm.setValue({
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message',
      });

      expect(component.contactForm.valid).toBeTrue();

      component.onSubmit();

      expect(window.alert).toHaveBeenCalledWith('Mensaje enviado con éxito!');
      expect(component.contactForm.reset).toHaveBeenCalled();
    });
  });
});
