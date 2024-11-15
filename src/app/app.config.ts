import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { AboutPageComponent } from './features/about/about-page/about-page.component';
import { LoginFormComponent } from './features/login/login-form/login-form.component';
import { ProductsListComponent } from './features/products/products-list/products-list.component';
import { HomePageComponent } from './features/home/home-page/home-page.component';
import { ContactComponent } from './features/contact/contact-form/contact-form.component';
import { ForgotPasswordComponent } from './features/forgot-password/forgot-password-form/forgot-password-form.component';
import { RegisterFormComponent } from './features/register/register-form/register-form.component';
import { CataloguePageComponent } from './features/catalogue/catalogue-page/catalogue-page.component';



export const APP_ROUTES: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'login', component: LoginFormComponent },
  { path: 'products', component: ProductsListComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'forgot-password-form', component: ForgotPasswordComponent },
  { path: 'register', component: RegisterFormComponent },
  { path: 'catalogue-page', component: CataloguePageComponent },

  { path: '**', redirectTo: '' }
];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(APP_ROUTES)]
};
