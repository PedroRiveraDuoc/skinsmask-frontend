import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from './shared/nav/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'skinsmask-frontend';
  contentLoaded = false;

  constructor(private router: Router) {
    console.log('Configuración de rutas:', this.router.config);
    this.router.events.subscribe(event => {
      console.log('Evento de Router:', event);
    });
  }
}
