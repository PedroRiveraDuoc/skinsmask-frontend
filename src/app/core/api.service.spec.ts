import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('#get', () => {
    it('should handle errors on GET request', () => {
      const endpoint = 'test-endpoint';

      service.get<{ key: string }>(endpoint).subscribe({
        next: () => fail('Expected an error'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        },
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/${endpoint}`);
      req.flush('Error', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('#post', () => {
    it('should send a POST request to the correct URL with the provided data', () => {
      const endpoint = 'test-endpoint';
      const mockData = { key: 'value' }; // Datos enviados
      const responseData = { key: 'responseValue' }; // Datos esperados como respuesta

      service.post<{ key: string }>(endpoint, mockData).subscribe((response) => {
        expect(response).toEqual(responseData);
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/${endpoint}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockData);
      req.flush(responseData);
    });

    it('should handle errors on POST request', () => {
      const endpoint = 'test-endpoint';
      const mockData = { key: 'value' };

      service.post<{ key: string }>(endpoint, mockData).subscribe({
        next: () => fail('Expected an error'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        },
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/${endpoint}`);
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
