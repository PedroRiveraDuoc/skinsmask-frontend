import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthRoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRoles = route.data['roles'];
    const userData = this.authService.getAuthenticatedUserData();

    if (!userData || !userData.roles || !requiredRoles.some((role: string) => userData.roles.includes(role))) {
      this.router.navigate(['/unauthorized']); // Redirige si no tiene permisos
      return false;
    }
    return true;
  }
}
