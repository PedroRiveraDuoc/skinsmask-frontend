import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsListComponent } from './products-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Para simular peticiones HTTP
import { RouterTestingModule } from '@angular/router/testing'; // Si utiliza rutas
import { ProductService } from '../../../core/product.service'; // Ajusta el path según tu estructura

describe('ProductsListComponent', () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductsListComponent,
        HttpClientTestingModule, // Simulación de peticiones HTTP
        RouterTestingModule, // Para manejar rutas si es necesario
      ],
      providers: [
        ProductService, // Servicio necesario para manejar productos
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Verificar que se crea correctamente
  });
});
