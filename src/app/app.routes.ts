import { Routes } from '@angular/router';
import { CatalogueComponent } from './features/catalogue/catalogue.component';

import { AuthRoleGuard } from './core/auth-role.guard';
import { EditProfilePageComponent } from './features/edit-profile/edit-profile-page/edit-profile-page.component';

export const routes: Routes = [
  // Ruta accesible solo por ADMIN
  {
    path: 'products',
    component: CatalogueComponent,
    canActivate: [AuthRoleGuard],
    data: {
      roles: ['ROLE_ADMIN'], // Solo los usuarios con ROLE_ADMIN pueden acceder
    },
  },
  // Ruta accesible por ADMIN y USER
  {
    path: 'profile',
    component: EditProfilePageComponent,
    canActivate: [AuthRoleGuard],
    data: {
      roles: ['ROLE_ADMIN', 'ROLE_USER'], // Acceso para ambos roles
    },
  },
  // Otras rutas públicas o sin restricciones
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];
