import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditProfilePageComponent } from './edit-profile-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../core/user.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

describe('EditProfilePageComponent', () => {
  let component: EditProfilePageComponent;
  let fixture: ComponentFixture<EditProfilePageComponent>;
  let userServiceMock: jasmine.SpyObj<UserService>;
  let routerMock: jasmine.SpyObj<Router>;
  let swalFireSpy: jasmine.Spy;
  let store: { [key: string]: string } = {};

  beforeEach(async () => {
    // Mock de UserService y Router
    userServiceMock = jasmine.createSpyObj('UserService', ['getAuthenticatedUser', 'updateUserProfile']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, EditProfilePageComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditProfilePageComponent);
    component = fixture.componentInstance;

    // Mock de localStorage
    store = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string): string | null => {
      return store[key] || null;
    });
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): void => {
      store[key] = value;
    });
    spyOn(localStorage, 'removeItem').and.callFake((key: string): void => {
      delete store[key];
    });
    spyOn(localStorage, 'clear').and.callFake(() => {
      store = {};
    });

    // Espiar Swal.fire
    swalFireSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false }));

    fixture.detectChanges();
  });

  afterEach(() => {
    // Limpiar el store después de cada prueba
    store = {};
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize the form with required controls', () => {
      expect(component.editProfileForm).toBeDefined();
      expect(component.editProfileForm.get('firstName')).toBeDefined();
      expect(component.editProfileForm.get('lastName')).toBeDefined();
      expect(component.editProfileForm.get('email')).toBeDefined();
      expect(component.editProfileForm.get('password')).toBeDefined();
    });

    it('should have validation rules applied', () => {
      const firstNameControl = component.editProfileForm.get('firstName');
      const lastNameControl = component.editProfileForm.get('lastName');
      const emailControl = component.editProfileForm.get('email');
      const passwordControl = component.editProfileForm.get('password');

      expect(firstNameControl?.validator).toBeTruthy();
      expect(lastNameControl?.validator).toBeTruthy();
      expect(emailControl?.validator).toBeTruthy();
      expect(passwordControl?.validator).toBeNull(); // Password es opcional
    });
  });

  describe('ngOnInit', () => {
    it('should call loadUserProfile on init', () => {
      spyOn(component, 'loadUserProfile');
      component.ngOnInit();
      expect(component.loadUserProfile).toHaveBeenCalled();
    });
  });

  describe('loadUserProfile', () => {
    it('should set error message if token is not found', () => {
      store['token'] = ''; // Simular que no hay token
      component.loadUserProfile();
      expect(component.errorMessage).toBe('No estás autenticado. Inicia sesión nuevamente.');
    });

    it('should call userService.getAuthenticatedUser if token is found', () => {
      const mockUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };
      store['token'] = 'abc123';
      userServiceMock.getAuthenticatedUser.and.returnValue(of(mockUser));

      component.loadUserProfile();

      expect(userServiceMock.getAuthenticatedUser).toHaveBeenCalledWith('abc123');
      expect(component.editProfileForm.value).toEqual({
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        password: '', // Password permanece vacío
      });
    });
  });

  describe('onSubmit', () => {
    it('should set error message if form is invalid', () => {
      component.editProfileForm.patchValue({
        firstName: '',
        lastName: '',
        email: 'invalid-email',
      });
      component.onSubmit();
      expect(component.errorMessage).toBe('Por favor completa todos los campos correctamente.');
      expect(userServiceMock.updateUserProfile).not.toHaveBeenCalled();
    });

    it('should call userService.updateUserProfile when form is valid', fakeAsync(() => {
      const updatedProfile = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: '', // Password es opcional
      };
      component.editProfileForm.patchValue(updatedProfile);
      userServiceMock.updateUserProfile.and.returnValue(of({}));

      component.onSubmit();

      expect(userServiceMock.updateUserProfile).toHaveBeenCalledWith(updatedProfile);

      // Verificar que se muestra el mensaje de éxito y se navega
      expect(swalFireSpy).toHaveBeenCalledWith({
        title: '¡Perfil actualizado!',
        text: 'Tus cambios se han guardado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#ff2847',
      });

      // Simular la resolución del Promise de Swal.fire
      tick();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/profile']);
    }));

    it('should handle error when updateUserProfile fails', fakeAsync(() => {
      const updatedProfile = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: '',
      };
      component.editProfileForm.patchValue(updatedProfile);
      const errorResponse = { error: 'Error al actualizar el perfil' };
      userServiceMock.updateUserProfile.and.returnValue(throwError(() => errorResponse));

      component.onSubmit();

      expect(userServiceMock.updateUserProfile).toHaveBeenCalledWith(updatedProfile);

      // Verificar que se muestra el mensaje de error
      expect(swalFireSpy).toHaveBeenCalledWith({
        title: 'Error',
        text: errorResponse.error || 'Hubo un problema al actualizar el perfil. Intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#ff2847',
      });

      expect(component.errorMessage).toBe(errorResponse.error || 'Error al actualizar el perfil.');
    }));
  });
});
