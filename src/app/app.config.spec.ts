import { APP_ROUTES, appConfig } from './app.config';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppConfig', () => {
  it('should define all the routes correctly', () => {
    const expectedRoutes = [
      { path: '', component: jasmine.any(Function) },
      { path: 'about', component: jasmine.any(Function) },
      { path: 'login', component: jasmine.any(Function) },
      { path: 'products', component: jasmine.any(Function) },
      { path: 'contact', component: jasmine.any(Function) },
      { path: 'forgot-password-form', component: jasmine.any(Function) },
      { path: 'register', component: jasmine.any(Function) },
      { path: 'edit-profile', component: jasmine.any(Function) },
      { path: 'catalogue', component: jasmine.any(Function) },
      { path: '**', redirectTo: '' },
    ];

    expect(APP_ROUTES).toEqual(expectedRoutes);
  });

  it('should provide the correct application configuration', () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideRouter(APP_ROUTES)],
    });

    const router = TestBed.inject(Router);
    expect(router.config).toEqual(APP_ROUTES);
  });
});
