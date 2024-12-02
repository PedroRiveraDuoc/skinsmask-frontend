import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Módulo para simular peticiones HTTP

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Agregar HttpClientTestingModule para simular HttpClient
      providers: [ApiService], // Asegurarse de que el servicio esté disponible
    });
    service = TestBed.inject(ApiService); // Inyectar el servicio
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); // Verificar que el servicio se crea correctamente
  });

  // Agrega más tests para métodos del servicio si es necesario
});
