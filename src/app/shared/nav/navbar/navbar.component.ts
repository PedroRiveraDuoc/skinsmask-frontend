import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * NavComponent
 *
 * Este componente maneja la barra de navegación de la aplicación.
 */
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavComponent {
  /**
   * Título de la aplicación.
   */
  title: string = 'SkinsMask';
}
