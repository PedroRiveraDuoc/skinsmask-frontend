import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/user.service';
import { CommonModule } from '@angular/common';
import { matchPasswordsValidator } from '../../../core/password-match.validator';


@Component({
  selector: 'app-register-form',
  standalone: true,
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  imports: [ReactiveFormsModule, CommonModule], // Importa el módulo reactivo para formularios
})
export class RegisterFormComponent {
  registerForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, @Inject(UserService) private userService: UserService) {
    // Crear el formulario con validaciones
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_]+$')]], // Se agrega el campo username
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      roles: [['ROLE_USER'], Validators.required] // Valor predeterminado
    }, { validators: matchPasswordsValidator() });
  }

  // Validar si las contraseñas coinciden
  private passwordsMatch(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    return password === confirmPassword;
  }

  // Método ejecutado al enviar el formulario
  onSubmit() {
    if (!this.registerForm.valid) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      this.successMessage = '';
      return;
    }

    if (!this.passwordsMatch()) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      this.successMessage = '';
      return;
    }

    const { firstName, lastName, username, email, password, roles } = this.registerForm.value;

    this.userService
      .register({
        firstName,
        lastName,
        username,
        email,
        password,
        roles
      })
      .subscribe({
        next: () => {
          this.successMessage = 'Registro exitoso. ¡Ahora puedes iniciar sesión!';
          this.errorMessage = '';
          this.registerForm.reset(); // Limpia el formulario
        },
        error: (err: any) => {
          console.error(err);
          this.errorMessage = 'Hubo un error al registrarte. Inténtalo de nuevo.';
          this.successMessage = '';
        },
      });
  }
}
