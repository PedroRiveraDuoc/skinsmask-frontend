import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, Routes, withDebugTracing } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

// Importa tus componentes existentes
import { AboutPageComponent } from './features/about/about-page/about-page.component';
import { LoginFormComponent } from './features/login/login-form/login-form.component';
import { ProductsListComponent } from './features/products/products-list/products-list.component';
import { HomePageComponent } from './features/home/home-page/home-page.component';
import { ContactComponent } from './features/contact/contact-form/contact-form.component';
import { ForgotPasswordFormComponent } from './features/forgot-password/forgot-password-form/forgot-password-form.component';
import { RegisterFormComponent } from './features/register/register-form/register-form.component';
import { EditProfilePageComponent } from './features/edit-profile/edit-profile-page/edit-profile-page.component';
import { CommonModule } from '@angular/common';

// Define tus rutas de la aplicación
export const APP_ROUTES: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'login', component: LoginFormComponent },
  { path: 'products', component: ProductsListComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'forgot-password-form', component: ForgotPasswordFormComponent },
  { path: 'register', component: RegisterFormComponent },
  { path: 'edit-profile', component: EditProfilePageComponent },
  { path: '**', redirectTo: '' },
];

// Configuración de la aplicación
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES),
    provideHttpClient(),
  ],
};

