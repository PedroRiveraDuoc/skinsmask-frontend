import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginFormComponent } from './login-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Para simular peticiones HTTP
import { ReactiveFormsModule } from '@angular/forms'; // Para manejar formularios reactivos
import { RouterTestingModule } from '@angular/router/testing'; // Para manejar rutas en las pruebas
import { AuthService } from '../../../core/auth.service'; // Ajusta el path según tu estructura

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginFormComponent,
        HttpClientTestingModule, // Simulación de peticiones HTTP
        ReactiveFormsModule, // Para manejar formularios reactivos
        RouterTestingModule, // Para manejar rutas
      ],
      providers: [
        AuthService, // Servicio necesario para manejar autenticación
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Verifica que el componente se crea correctamente
  });
});
