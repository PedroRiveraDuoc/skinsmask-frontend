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

  beforeEach(async () => {
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

    // Spy para Swal.fire
    swalFireSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false }));
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should call userService.updateUserProfile when form is valid', fakeAsync(() => {
      const updatedProfile = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        username: 'janedoe',
        password: '',
      };

      component.editProfileForm.setValue(updatedProfile); // Configurar valores válidos
      userServiceMock.updateUserProfile.and.returnValue(of({})); // Simular éxito

      component.onSubmit();

      expect(userServiceMock.updateUserProfile).toHaveBeenCalledWith(updatedProfile);
      tick(); // Resolver Promise de Swal.fire
      expect(swalFireSpy).toHaveBeenCalledWith({
        title: '¡Perfil actualizado!',
        text: 'Tus cambios se han guardado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#ff2847',
      });
      expect(routerMock.navigate).toHaveBeenCalledWith(['/profile']);
    }));

    it('should handle error when updateUserProfile fails', fakeAsync(() => {
      const updatedProfile = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        username: 'janedoe',
        password: '',
      };

      component.editProfileForm.setValue(updatedProfile); // Configurar valores válidos
      const errorResponse = { error: 'Error al actualizar el perfil' };
      userServiceMock.updateUserProfile.and.returnValue(throwError(() => errorResponse)); // Simular error

      component.onSubmit();

      expect(userServiceMock.updateUserProfile).toHaveBeenCalledWith(updatedProfile);
      tick(); // Resolver Promise de Swal.fire
      expect(swalFireSpy).toHaveBeenCalledWith({
        title: 'Error',
        text: errorResponse.error || 'Hubo un problema al actualizar el perfil. Intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#ff2847',
      });
      expect(component.errorMessage).toBe(errorResponse.error || 'Error al actualizar el perfil.');
    }));

    it('should set error message if form is invalid', () => {
      component.editProfileForm.patchValue({
        firstName: '',
        lastName: '',
        email: 'invalid-email',
        password: '',
      });

      component.onSubmit();

      expect(component.errorMessage).toBe('Por favor completa todos los campos correctamente.');
      expect(userServiceMock.updateUserProfile).not.toHaveBeenCalled();
    });
  });

  describe('loadUserProfile', () => {
    it('should call userService.getAuthenticatedUser if token is found', () => {
      const mockUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        username: 'johndoe',
      };

      spyOn(localStorage, 'getItem').and.returnValue('abc123'); // Simular token
      userServiceMock.getAuthenticatedUser.and.returnValue(of(mockUser));

      component.loadUserProfile();

      expect(userServiceMock.getAuthenticatedUser).toHaveBeenCalledWith('abc123');
      expect(component.editProfileForm.value).toEqual({
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        username: mockUser.username,
        email: mockUser.email,
        password: '',
      });
    });

    it('should set error message if token is not found', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null); // Simular falta de token

      component.loadUserProfile();

      expect(component.errorMessage).toBe('No estás autenticado. Inicia sesión nuevamente.');
    });
  });
});
