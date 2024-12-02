import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password-form.component.html',
  styleUrls: ['./forgot-password-form.component.scss'],
})
export class ForgotPasswordFormComponent {
  forgotPasswordForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, ingresa un correo electrónico válido.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#ff2847',
      });
      return;
    }

    const email = this.forgotPasswordForm.value.email;

    // Simula la lógica para recuperar contraseña
    this.simulatePasswordRecovery(email);
  }

  simulatePasswordRecovery(email: string): void {
    // Generar un número aleatorio seguro
    const randomValue = crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1);
    const isSuccess = randomValue > 0.5; // Aleatorio seguro para simular respuesta

    if (isSuccess) {
      Swal.fire({
        title: '¡Éxito!',
        text: `Se ha enviado un enlace de recuperación a ${email}.`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#ff2847',
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al intentar enviar el enlace. Por favor, intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#ff2847',
      });
    }
  }
}
