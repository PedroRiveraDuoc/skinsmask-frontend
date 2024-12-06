import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../../core/auth.service';
import { of } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authServiceMock = jasmine.createSpyObj('AuthService', [
      'isAuthenticated$',
      'getAuthenticatedUserData',
      'logout',
    ]);

    TestBed.configureTestingModule({
      imports: [NavbarComponent], // Importamos el componente standalone en lugar de declararlo
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    });

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    // Mock observables
    authServiceSpy.isAuthenticated$ = of(false);
    authServiceSpy.getAuthenticatedUserData.and.returnValue(null);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set isAuthenticated and user data when authenticated', () => {
      const mockUserData = { roles: ['ROLE_USER'], username: 'test@example.com' };
      authServiceSpy.isAuthenticated$ = of(true);
      authServiceSpy.getAuthenticatedUserData.and.returnValue(mockUserData);

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.isAuthenticated).toBeTrue();
      expect(component.userRoles).toEqual(['ROLE_USER']);
      expect(component.email).toBe('test@example.com');
    });

    it('should reset user data when not authenticated', () => {
      authServiceSpy.isAuthenticated$ = of(false);

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.isAuthenticated).toBeFalse();
      expect(component.userRoles).toEqual([]);
      expect(component.email).toBeNull();
    });
  });

  describe('logout', () => {
    it('should call AuthService.logout', () => {
      component.logout();
      expect(authServiceSpy.logout).toHaveBeenCalled();
    });
  });

  describe('handleKeyDown', () => {
    it('should trigger click on dropdown when Enter is pressed', () => {
      const dropdownMock = document.createElement('div');
      dropdownMock.id = 'userDropdown';
      spyOn(dropdownMock, 'click');
      document.body.appendChild(dropdownMock);

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.handleKeyDown(event);

      expect(dropdownMock.click).toHaveBeenCalled();
      document.body.removeChild(dropdownMock);
    });

    it('should trigger click on dropdown when Space is pressed', () => {
      const dropdownMock = document.createElement('div');
      dropdownMock.id = 'userDropdown';
      spyOn(dropdownMock, 'click');
      document.body.appendChild(dropdownMock);

      const event = new KeyboardEvent('keydown', { key: ' ' });
      component.handleKeyDown(event);

      expect(dropdownMock.click).toHaveBeenCalled();
      document.body.removeChild(dropdownMock);
    });

    it('should do nothing for other keys', () => {
      const dropdownMock = document.createElement('div');
      dropdownMock.id = 'userDropdown';
      spyOn(dropdownMock, 'click');
      document.body.appendChild(dropdownMock);

      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      component.handleKeyDown(event);

      expect(dropdownMock.click).not.toHaveBeenCalled();
      document.body.removeChild(dropdownMock);
    });
  });
});
