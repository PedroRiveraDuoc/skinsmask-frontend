import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditProfilePageComponent } from './edit-profile-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Para simular peticiones HTTP
import { ReactiveFormsModule } from '@angular/forms'; // Para manejar formularios reactivos
import { provideRouter } from '@angular/router'; // Para manejar rutas
import { UserService } from '../../../core/user.service'; // Ajusta el path según tu estructura

describe('EditProfilePageComponent', () => {
  let component: EditProfilePageComponent;
  let fixture: ComponentFixture<EditProfilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EditProfilePageComponent, // Importar directamente porque es standalone
        HttpClientTestingModule, // Simular peticiones HTTP
        ReactiveFormsModule, // Para manejar formularios reactivos
      ],
      providers: [
        provideRouter([]), // Simular rutas
        UserService, // Proveedor necesario para manejar datos de usuario
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Verificar que el componente se crea correctamente
  });
});
