import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/user.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-profile-page.component.html',
  styleUrls: ['./edit-profile-page.component.scss']
})
export class EditProfilePageComponent implements OnInit {
  editProfileForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    // Form initialization with validation rules
    this.editProfileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: [''] // Optional password field
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  /**
   * Load the authenticated user's profile.
   */
  loadUserProfile(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.errorMessage = 'No estás autenticado. Inicia sesión nuevamente.';
      console.warn('Token no encontrado en el almacenamiento local.');
      return;
    }

    this.userService.getAuthenticatedUser(token).subscribe({
      next: (user) => {
        console.log('Perfil cargado con éxito:', user); // Log para depuración
        this.editProfileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
      },
    });
  }

  /**
   * Submit the updated profile.
   */
  onSubmit(): void {
    if (this.editProfileForm.invalid) {
      this.errorMessage = 'Por favor completa todos los campos correctamente.';
      console.warn('Formulario inválido. Revisa los campos antes de enviar.');
      return;
    }

    const updatedProfile = this.editProfileForm.value;
    console.log('Datos enviados para la actualización del perfil:', updatedProfile); // Log para depuración

    this.userService.updateUserProfile(updatedProfile).subscribe({
      next: () => {
        console.log('Perfil actualizado exitosamente.'); // Log para depuración
        Swal.fire({
          title: '¡Perfil actualizado!',
          text: 'Tus cambios se han guardado exitosamente.',
          icon: 'success',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#ff2847',
        }).then(() => {
          this.router.navigate(['/profile']);
        });
      },
      error: (err) => {
        console.error('Error al actualizar el perfil:', err); // Log para depuración
        Swal.fire({
          title: 'Error',
          text: err.error || 'Hubo un problema al actualizar el perfil. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#ff2847',
        });
        this.errorMessage = err.error || 'Error al actualizar el perfil.';
      },
    });
  }
}
