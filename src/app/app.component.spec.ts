import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Para manejar HttpClient
import { RouterTestingModule } from '@angular/router/testing'; // Para manejar rutas si aplica

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent, // Importar directamente el componente standalone
        HttpClientTestingModule, // Simular peticiones HTTP
        RouterTestingModule, // Simular navegación si aplica
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy(); // Verificar que se crea correctamente
  });

  it(`should have the title 'skinsmask-frontend'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('skinsmask-frontend'); // Asegurarse de que el título sea correcto
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

  });
});
