import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductsListComponent } from './products-list.component';
import { ProductService, Product } from '../../../core/product.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('ProductsListComponent', () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;
  let productServiceMock: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    // Crear un mock de ProductService
    productServiceMock = jasmine.createSpyObj('ProductService', [
      'getAllProducts',
      'createProduct',
      'updateProduct',
      'deleteProduct',
    ]);

    await TestBed.configureTestingModule({
      imports: [ProductsListComponent, FormsModule],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
    // No llamamos a fixture.detectChanges() aquí
  });

  afterEach(() => {
    // Limpiar después de cada prueba
    productServiceMock.getAllProducts.calls.reset();
    productServiceMock.createProduct.calls.reset();
    productServiceMock.updateProduct.calls.reset();
    productServiceMock.deleteProduct.calls.reset();
  });

  it('should create the component', () => {
    // Configurar el retorno del mock
    productServiceMock.getAllProducts.and.returnValue(of([]));

    // Ahora podemos llamar a fixture.detectChanges()
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadProducts', () => {
      spyOn(component, 'loadProducts');

      // Llamar a ngOnInit
      component.ngOnInit();

      expect(component.loadProducts).toHaveBeenCalled();
    });
  });

  describe('loadProducts', () => {
    it('should load products and handle imageUrls correctly', () => {
      const mockProducts: Product[] = [
        {
          id: 1,
          name: 'Product 1',
          description: 'Description 1',
          price: 10.0,
          stock: 100,
          categoryId: 1,
          imageUrls: ['url1', 'url2'],
        },
        {
          id: 2,
          name: 'Product 2',
          description: 'Description 2',
          price: 20.0,
          stock: 200,
          categoryId: 2,
          imageUrls: ['url3'],
        },
        {
          id: 3,
          name: 'Product 3',
          description: 'Description 3',
          price: 30.0,
          stock: 300,
          categoryId: 3,
          imageUrls: [],
        },
      ];

      productServiceMock.getAllProducts.and.returnValue(of(mockProducts));

      // Llamamos a loadProducts
      component.loadProducts();

      expect(productServiceMock.getAllProducts).toHaveBeenCalled();

      // Verificar que los productos se asignaron correctamente
      expect(component.products.length).toBe(3);

      // Verificar que imageUrls se procesaron correctamente
      expect(component.products[0].imageUrls).toEqual(['url1', 'url2']);
      expect(component.products[1].imageUrls).toEqual(['url3']);
      expect(component.products[2].imageUrls).toEqual([]);
    });

    it('should handle error when loading products fails', () => {
      const errorResponse = new Error('Error al cargar productos');
      spyOn(console, 'error');
      productServiceMock.getAllProducts.and.returnValue(throwError(() => errorResponse));

      component.loadProducts();

      expect(productServiceMock.getAllProducts).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Error al cargar productos:', errorResponse);
      expect(component.products).toEqual([]);
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.currentProduct = {
        name: 'New Product',
        description: 'New Description',
        price: 50.0,
        stock: 500,
        categoryId: 5,
        imageUrls: [],
      };
      component.imageUrlsInput = 'url1, url2';
    });

    it('should create a new product when not editing', fakeAsync(() => {
      productServiceMock.createProduct.and.returnValue(of(component.currentProduct));
      productServiceMock.getAllProducts.and.returnValue(of([])); // Para loadProducts

      component.isEditing = false;

      // Preparar expectedProduct antes de llamar a onSubmit
      const expectedProduct: Product = {
        ...component.currentProduct,
        imageUrls: component.imageUrlsInput.split(',').map(url => url.trim()).filter(url => url !== ''),
      };

      component.onSubmit();

      // Simular la respuesta y tiempo necesario
      tick();

      expect(productServiceMock.createProduct).toHaveBeenCalledWith(jasmine.objectContaining(expectedProduct));

      // Verificar que se recargaron los productos y se reinició el formulario
      expect(productServiceMock.getAllProducts).toHaveBeenCalled();
      expect(component.currentProduct).toEqual(component.initializeProduct());
      expect(component.imageUrlsInput).toBe('');
      expect(component.isEditing).toBeFalse();
    }));

    it('should update a product when editing', fakeAsync(() => {
      component.currentProduct.id = 1; // Asignar un ID para simular edición
      productServiceMock.updateProduct.and.returnValue(of(component.currentProduct));
      productServiceMock.getAllProducts.and.returnValue(of([])); // Para loadProducts

      component.isEditing = true;

      // Preparar expectedProduct antes de llamar a onSubmit
      const expectedProduct: Product = {
        ...component.currentProduct,
        id: 1,
        imageUrls: component.imageUrlsInput.split(',').map(url => url.trim()).filter(url => url !== ''),
      };

      component.onSubmit();

      // Simular la respuesta y tiempo necesario
      tick();

      expect(productServiceMock.updateProduct).toHaveBeenCalledWith(1, jasmine.objectContaining(expectedProduct));

      // Verificar que se recargaron los productos y se reinició el formulario
      expect(productServiceMock.getAllProducts).toHaveBeenCalled();
      expect(component.currentProduct).toEqual(component.initializeProduct());
      expect(component.imageUrlsInput).toBe('');
      expect(component.isEditing).toBeFalse();
    }));
  });

  describe('editProduct', () => {
    it('should set currentProduct and imageUrlsInput for editing', () => {
      const productToEdit: Product = {
        id: 1,
        name: 'Product to Edit',
        description: 'Description',
        price: 60.0,
        stock: 600,
        categoryId: 6,
        imageUrls: ['url1', 'url2'],
      };

      // No necesitamos fixture.detectChanges() aquí

      component.editProduct(productToEdit);

      expect(component.currentProduct).toEqual(productToEdit);
      expect(component.imageUrlsInput).toBe('url1, url2');
      expect(component.isEditing).toBeTrue();
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product and reload products', fakeAsync(() => {
      productServiceMock.deleteProduct.and.returnValue(of(undefined));
      productServiceMock.getAllProducts.and.returnValue(of([])); // Para loadProducts

      component.deleteProduct(1);

      expect(productServiceMock.deleteProduct).toHaveBeenCalledWith(1);

      // Simular la respuesta y tiempo necesario
      tick();

      // Verificar que se recargaron los productos
      expect(productServiceMock.getAllProducts).toHaveBeenCalled();
    }));
  });

  describe('resetForm', () => {
    it('should reset the form to initial state', () => {
      component.currentProduct = {
        id: 1,
        name: 'Product',
        description: 'Description',
        price: 70.0,
        stock: 700,
        categoryId: 7,
        imageUrls: ['url1'],
      };
      component.imageUrlsInput = 'url1';
      component.isEditing = true;

      component.resetForm();

      expect(component.currentProduct).toEqual(component.initializeProduct());
      expect(component.imageUrlsInput).toBe('');
      expect(component.isEditing).toBeFalse();
    });
  });

  describe('cancelEdit', () => {
    it('should cancel editing and reset currentProduct', () => {
      component.isEditing = true;
      component.currentProduct = {
        id: 1,
        name: 'Product',
        description: 'Description',
        price: 80.0,
        stock: 800,
        categoryId: 8,
        imageUrls: ['url1'],
      };

      component.cancelEdit();

      expect(component.isEditing).toBeFalse();
      expect(component.currentProduct).toEqual(component.initializeProduct());
    });
  });

  describe('initializeProduct', () => {
    it('should return a new product with default values', () => {
      const newProduct = component.initializeProduct();
      expect(newProduct).toEqual({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        categoryId: 0,
        imageUrls: [],
      });
    });
  });
});
