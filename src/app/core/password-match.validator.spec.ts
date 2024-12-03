import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { matchPasswordsValidator } from './password-match.validator';

describe('PasswordMatchValidator', () => {
  let formGroup: FormGroup;
  let fb: FormBuilder;

  beforeEach(() => {
    fb = new FormBuilder();
    formGroup = fb.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validators: matchPasswordsValidator() }
    );
  });

  it('should not return an error if both passwords match', () => {
    formGroup.patchValue({
      password: 'test1234',
      confirmPassword: 'test1234',
    });

    expect(formGroup.valid).toBeTrue();
    expect(formGroup.get('confirmPassword')?.errors).toBeNull();
  });

  it('should return an error if passwords do not match', () => {
    formGroup.patchValue({
      password: 'test1234',
      confirmPassword: 'different1234',
    });

    expect(formGroup.valid).toBeFalse();
    expect(formGroup.get('confirmPassword')?.errors).toEqual({ passwordsDoNotMatch: true });
  });

  it('should remove the error when passwords start matching', () => {
    formGroup.patchValue({
      password: 'test1234',
      confirmPassword: 'different1234',
    });

    expect(formGroup.valid).toBeFalse();

    formGroup.patchValue({
      confirmPassword: 'test1234',
    });

    expect(formGroup.valid).toBeTrue();
    expect(formGroup.get('confirmPassword')?.errors).toBeNull();
  });

  it('should not set errors if password control is missing', () => {
    const incompleteFormGroup = fb.group(
      {
        confirmPassword: ['test1234'],
      },
      { validators: matchPasswordsValidator() }
    );

    expect(incompleteFormGroup.valid).toBeTrue();
    expect(incompleteFormGroup.get('confirmPassword')?.errors).toBeNull();
  });

  it('should not set errors if confirmPassword control is missing', () => {
    const incompleteFormGroup = fb.group(
      {
        password: ['test1234'],
      },
      { validators: matchPasswordsValidator() }
    );

    expect(incompleteFormGroup.valid).toBeTrue();
    expect(incompleteFormGroup.get('password')?.errors).toBeNull();
  });

  it('should handle scenarios with empty passwords gracefully', () => {
    formGroup.patchValue({
      password: '',
      confirmPassword: '',
    });

    expect(formGroup.valid).toBeFalse(); // El formulario es inválido debido a Validators.required

    expect(formGroup.get('password')?.errors).toEqual({ required: true });
    expect(formGroup.get('confirmPassword')?.errors).toEqual({ required: true });
  });

  it('should return an error if password is empty and confirmPassword is not', () => {
    formGroup.patchValue({
      password: '',
      confirmPassword: 'test1234',
    });

    expect(formGroup.valid).toBeFalse();

    expect(formGroup.get('password')?.errors).toEqual({ required: true });

    const errors = formGroup.get('confirmPassword')?.errors;
    expect(errors).toBeTruthy();
    expect(errors!['passwordsDoNotMatch']).toBeTrue();
  });

  it('should return an error if password is not empty and confirmPassword is empty', () => {
    formGroup.patchValue({
      password: 'test1234',
      confirmPassword: '',
    });

    expect(formGroup.valid).toBeFalse();

    const errors = formGroup.get('confirmPassword')?.errors;
    expect(errors).toBeTruthy();
    expect(errors!['required']).toBeTrue();
    expect(errors!['passwordsDoNotMatch']).toBeTrue();
  });

  it('should remove passwordsDoNotMatch error when passwords match', () => {
    formGroup.patchValue({
      password: 'test1234',
      confirmPassword: 'different1234',
    });

    expect(formGroup.get('confirmPassword')?.errors).toEqual({ passwordsDoNotMatch: true });

    // Ahora hacemos que las contraseñas coincidan
    formGroup.patchValue({
      confirmPassword: 'test1234',
    });

    // El error 'passwordsDoNotMatch' debe ser eliminado
    expect(formGroup.get('confirmPassword')?.errors).toBeNull();
  });
});
