import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterFormComponent } from './register-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Para simular peticiones HTTP
import { ReactiveFormsModule } from '@angular/forms'; // Si utiliza formularios reactivos
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../../core/user.service'; // Ajusta el path según tu estructura

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegisterFormComponent,
        HttpClientTestingModule, // Para simular peticiones HTTP
        ReactiveFormsModule, // Para manejar formularios reactivos
        RouterTestingModule, // Para manejar rutas si aplica
      ],
      providers: [
        UserService, // Servicio necesario para manejar usuarios
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Verifica que el componente se crea correctamente
  });
});
