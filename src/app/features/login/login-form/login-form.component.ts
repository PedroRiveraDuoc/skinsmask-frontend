import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor completa todos los campos correctamente.';
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Inicio de sesión exitoso!',
          text: 'Bienvenido de nuevo.',
          icon: 'success',
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#ff2847',
        }).then(() => {
          this.router.navigate(['/home']);
        });
      },
      error: (err) => {
        if (err.status === 401) {
          Swal.fire({
            title: 'Error de credenciales',
            text: 'Correo o contraseña incorrectos.',
            icon: 'error',
            confirmButtonText: 'Intentar de nuevo',
            confirmButtonColor: '#ff2847',
          });
        } else {
          Swal.fire({
            title: 'Error inesperado',
            text: 'Hubo un problema al iniciar sesión. Intenta nuevamente más tarde.',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#ff2847',
          });
        }
      },
    });
  }
}
