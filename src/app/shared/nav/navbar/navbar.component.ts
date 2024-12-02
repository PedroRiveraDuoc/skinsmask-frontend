import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = false;
  email: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Suscribirse a cambios en el estado de autenticación
    this.authService.isAuthenticated$.subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
    });

    // Suscribirse al correo actualizado
    this.authService.username$.subscribe((email) => {
      this.email = email;
    });
  }

  /**
   * Actualiza el correo en caso de cambio.
   */
  updateEmail(email: string): void {
    this.authService.setUpdatedEmail(email); // Utiliza el método del servicio para actualizar el correo
  }

  logout(): void {
    this.authService.logout();
  }

  /**
   * Maneja eventos de teclado para elementos interactivos.
   */
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Previene el comportamiento predeterminado
      const dropdownToggle = document.getElementById('userDropdown');
      if (dropdownToggle) {
        dropdownToggle.click(); // Simula el clic en el elemento
      }
    }
  }
}
