import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Inicializar el formulario con validaciones
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });
  }

  // Método para manejar el envío del formulario
  onSubmit(): void {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      alert(`Usuario registrado: ${formData.firstName} ${formData.lastName}`);
    } else {
      alert('Por favor, completa todos los campos correctamente.');
    }
  }
}
