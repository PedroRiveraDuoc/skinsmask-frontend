import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = false;
  userRoles: string[] = [];
  email: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        const userData = this.authService.getAuthenticatedUserData();
        if (userData) {
          this.userRoles = userData.roles || [];
          this.email = userData.username || null;
        }
      } else {
        this.userRoles = [];
        this.email = null;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const dropdownToggle = document.getElementById('userDropdown');
      if (dropdownToggle) {
        dropdownToggle.click();
      }
    }
  }
}
