// product.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { ProductService, Product } from './product.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:9090/api/products';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifica que no haya solicitudes pendientes
    httpMock.verify();
  });

  describe('getAllProducts', () => {
    it('should retrieve all products (GET)', () => {
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
          imageUrls: ['url3', 'url4'],
        },
      ];

      service.getAllProducts().subscribe((products) => {
        expect(products).toEqual(mockProducts);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');

      req.flush(mockProducts);
    });

    it('should handle error when getAllProducts fails', () => {
      const errorMessage = 'Error al cargar los productos';
      spyOn(console, 'error');

      service.getAllProducts().subscribe({
        next: () => fail('Expected an error, but got a response'),
        error: (error) => {
          expect(console.error).toHaveBeenCalledWith('Error al cargar los productos:', error);
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');

      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getProductById', () => {
    it('should retrieve a product by ID (GET)', () => {
      const mockProduct: Product = {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        price: 10.0,
        stock: 100,
        categoryId: 1,
        imageUrls: ['url1', 'url2'],
      };

      service.getProductById(1).subscribe((product) => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('GET');

      req.flush(mockProduct);
    });

    it('should handle error when getProductById fails', () => {
      const errorMessage = 'Product not found';

      service.getProductById(999).subscribe({
        next: () => fail('Expected an error, but got a response'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/999`);
      expect(req.request.method).toBe('GET');

      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createProduct', () => {
    it('should create a new product (POST)', () => {
      const newProduct: Product = {
        name: 'New Product',
        description: 'New Description',
        price: 30.0,
        stock: 300,
        categoryId: 3,
        imageUrls: ['url5', 'url6'],
      };

      const createdProduct: Product = { ...newProduct, id: 3 };

      service.createProduct(newProduct).subscribe((product) => {
        expect(product).toEqual(createdProduct);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newProduct);

      req.flush(createdProduct);
    });

    it('should handle error when createProduct fails', () => {
      const newProduct: Product = {
        name: 'New Product',
        description: 'New Description',
        price: 30.0,
        stock: 300,
        categoryId: 3,
        imageUrls: ['url5', 'url6'],
      };

      service.createProduct(newProduct).subscribe({
        next: () => fail('Expected an error, but got a response'),
        error: (error) => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');

      req.flush('Invalid data', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product (PUT)', () => {
      const updatedProduct: Product = {
        id: 1,
        name: 'Updated Product',
        description: 'Updated Description',
        price: 40.0,
        stock: 400,
        categoryId: 4,
        imageUrls: ['url7', 'url8'],
      };

      service.updateProduct(1, updatedProduct).subscribe((product) => {
        expect(product).toEqual(updatedProduct);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedProduct);

      req.flush(updatedProduct);
    });

    it('should handle error when updateProduct fails', () => {
      const updatedProduct: Product = {
        id: 1,
        name: 'Updated Product',
        description: 'Updated Description',
        price: 40.0,
        stock: 400,
        categoryId: 4,
        imageUrls: ['url7', 'url8'],
      };

      service.updateProduct(1, updatedProduct).subscribe({
        next: () => fail('Expected an error, but got a response'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('PUT');

      req.flush('Product not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product by ID (DELETE)', () => {
      service.deleteProduct(1).subscribe((response) => {
        // Verificamos que la respuesta sea undefined
        expect(response).toBeUndefined();
      });

      // Simulamos la solicitud HTTP DELETE
      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('DELETE');

      // No pasamos ningún argumento a req.flush()
      req.flush(null); // Sin argumentos
    });

    it('should handle error when deleteProduct fails', () => {
      service.deleteProduct(999).subscribe({
        next: () => fail('Expected an error, but got a response'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/999`);
      expect(req.request.method).toBe('DELETE');

      req.flush('Product not found', { status: 404, statusText: 'Not Found' });
    });
  });


});
