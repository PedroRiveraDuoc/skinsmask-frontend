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
  styleUrl: './edit-profile-page.component.scss'
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
    console.log('Intentando cargar el perfil del usuario...');
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Token no encontrado. Redirigiendo al login.');
      this.errorMessage = 'No estás autenticado. Inicia sesión nuevamente.';
      return;
    }

    this.userService.getAuthenticatedUser(token).subscribe({
      next: (user) => {
        console.log('Datos del usuario cargados:', user);
        this.editProfileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
      },
      error: (err) => {
        console.error('Error al cargar el perfil del usuario:', err);
        this.errorMessage = 'Error al cargar el perfil. Por favor, intenta nuevamente.';
      },
    });
  }

  /**
   * Submit the updated profile.
   */
  onSubmit(): void {
    if (this.editProfileForm.invalid) {
      this.errorMessage = 'Por favor completa todos los campos correctamente.';
      return;
    }

    const updatedProfile = this.editProfileForm.value;

    this.userService.updateUserProfile(updatedProfile).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Perfil actualizado!',
          text: 'Tus cambios se han guardado exitosamente.',
          icon: 'success',
          confirmButtonText: 'Ok',
        }).then(() => {
          this.router.navigate(['/profile']);
        });
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: err.error || 'Hubo un problema al actualizar el perfil. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Cerrar',
        });
        this.errorMessage = err.error || 'Error al actualizar el perfil.';
      },
    });
  }
}
