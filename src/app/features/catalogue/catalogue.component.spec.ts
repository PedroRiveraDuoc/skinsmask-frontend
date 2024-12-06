import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogueComponent } from './catalogue.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductService } from '../../core/product.service';
import { of, throwError } from 'rxjs';

describe('CatalogueComponent', () => {
  let component: CatalogueComponent;
  let fixture: ComponentFixture<CatalogueComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    const productServiceMock = jasmine.createSpyObj('ProductService', ['getAllProducts']);

    // Configuración inicial para que el método getAllProducts devuelva un Observable vacío
    productServiceMock.getAllProducts.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [CatalogueComponent, HttpClientTestingModule],
      providers: [{ provide: ProductService, useValue: productServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogueComponent);
    component = fixture.componentInstance;
    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#loadProducts', () => {
    it('should load products successfully', () => {
      const mockProducts = [
        {
          id: 1,
          name: 'Product 1',
          price: 10,
          description: 'Description 1',
          stock: 100,
          categoryId: 1,
          imageUrls: ['image1.jpg'],
        },
        {
          id: 2,
          name: 'Product 2',
          price: 20,
          description: 'Description 2',
          stock: 200,
          categoryId: 2,
          imageUrls: ['image2.jpg'],
        },
      ];

      productServiceSpy.getAllProducts.and.returnValue(of(mockProducts));

      component.loadProducts();

      expect(productServiceSpy.getAllProducts).toHaveBeenCalled();
      expect(component.products).toEqual(mockProducts);
    });

    it('should handle error when loading products', () => {
      productServiceSpy.getAllProducts.and.returnValue(
        throwError(() => new Error('Error loading products'))
      );

      component.loadProducts();

      expect(productServiceSpy.getAllProducts).toHaveBeenCalled();
      expect(component.errorMessage).toBe(
        'Hubo un error al cargar los productos. Intenta nuevamente.'
      );
    });
  });
});
