import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export function matchPasswordsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    if (password !== confirmPassword) {
      confirmPasswordControl.setErrors({ passwordsDoNotMatch: true });
    } else {
      // Eliminar el error si las contraseñas coinciden
      const errors = confirmPasswordControl.errors;
      if (errors) {
        delete errors['passwordsDoNotMatch'];
        if (Object.keys(errors).length === 0) {
          confirmPasswordControl.setErrors(null);
        } else {
          confirmPasswordControl.setErrors(errors);
        }
      }
    }

    return null; // No establecer errores en el formulario
  };
}
