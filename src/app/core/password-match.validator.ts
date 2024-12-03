import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export function matchPasswordsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');

    if (!passwordControl || !confirmPasswordControl) {
      return null; // No hacemos nada si faltan controles
    }

    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    // Clonar los errores actuales para evitar mutaciones
    const confirmPasswordErrors = confirmPasswordControl.errors ? { ...confirmPasswordControl.errors } : {};

    // Remover 'passwordsDoNotMatch' si existe
    delete confirmPasswordErrors['passwordsDoNotMatch'];

    if (password !== confirmPassword) {
      // Agregar 'passwordsDoNotMatch' si las contraseñas no coinciden
      confirmPasswordErrors['passwordsDoNotMatch'] = true;
    }

    // Actualizar los errores del control
    if (Object.keys(confirmPasswordErrors).length > 0) {
      confirmPasswordControl.setErrors(confirmPasswordErrors);
    } else {
      confirmPasswordControl.setErrors(null);
    }

    return null; // No establecemos errores a nivel de formulario
  };
}
