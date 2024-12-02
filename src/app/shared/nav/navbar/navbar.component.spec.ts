import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Para simular HttpClient
import { AuthService } from '../../../core/auth.service'; // Servicio necesario para AuthService

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NavbarComponent,
        HttpClientTestingModule // Módulo para simular HttpClient
      ],
      providers: [
        provideRouter([]), // Proveedor de rutas
        AuthService, // Proveedor necesario para AuthService
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Verificar que se crea correctamente
  });
});
