import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../../core/auth.service';
import { BehaviorSubject } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceMock: any;

  beforeEach(async () => {
    authServiceMock = {
      isAuthenticated$: new BehaviorSubject<boolean>(false),
      username$: new BehaviorSubject<string | null>(null),
      setUpdatedEmail: jasmine.createSpy('setUpdatedEmail'),
      logout: jasmine.createSpy('logout'),
    };

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit se llama aquí
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should subscribe to isAuthenticated$ and update isAuthenticated', () => {
      // Valor inicial
      expect(component.isAuthenticated).toBeFalse();

      // Emitir nuevo valor
      authServiceMock.isAuthenticated$.next(true);
      expect(component.isAuthenticated).toBeTrue();
    });

    it('should subscribe to username$ and update email', () => {
      // Valor inicial
      expect(component.email).toBeNull();

      // Emitir nuevo valor
      const testEmail = 'test@example.com';
      authServiceMock.username$.next(testEmail);
      expect(component.email).toBe(testEmail);
    });
  });

  describe('updateEmail', () => {
    it('should call authService.setUpdatedEmail with the new email', () => {
      const newEmail = 'new@example.com';
      component.updateEmail(newEmail);
      expect(authServiceMock.setUpdatedEmail).toHaveBeenCalledWith(newEmail);
    });
  });

  describe('logout', () => {
    it('should call authService.logout', () => {
      component.logout();
      expect(authServiceMock.logout).toHaveBeenCalled();
    });
  });

  describe('handleKeyDown', () => {
    let event: KeyboardEvent;

    beforeEach(() => {
      event = new KeyboardEvent('keydown', { key: 'Enter' });
      spyOn(event, 'preventDefault');
    });

    it('should prevent default and click dropdown when key is Enter', () => {
      // Crear elemento simulado
      const dropdownToggle = document.createElement('div');
      dropdownToggle.id = 'userDropdown';
      spyOn(dropdownToggle, 'click');
      document.body.appendChild(dropdownToggle);

      component.handleKeyDown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(dropdownToggle.click).toHaveBeenCalled();

      // Limpiar
      document.body.removeChild(dropdownToggle);
    });

    it('should prevent default and click dropdown when key is Space', () => {
      event = new KeyboardEvent('keydown', { key: ' ' });
      spyOn(event, 'preventDefault');

      const dropdownToggle = document.createElement('div');
      dropdownToggle.id = 'userDropdown';
      spyOn(dropdownToggle, 'click');
      document.body.appendChild(dropdownToggle);

      component.handleKeyDown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(dropdownToggle.click).toHaveBeenCalled();

      document.body.removeChild(dropdownToggle);
    });

    it('should not do anything when key is not Enter or Space', () => {
      event = new KeyboardEvent('keydown', { key: 'Escape' });
      spyOn(event, 'preventDefault');

      component.handleKeyDown(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should not throw error if userDropdown element does not exist', () => {
      // Asegurarse de que el elemento no existe
      const existingElement = document.getElementById('userDropdown');
      if (existingElement) {
        existingElement.parentNode!.removeChild(existingElement);
      }

      expect(() => component.handleKeyDown(event)).not.toThrow();
    });
  });
});
