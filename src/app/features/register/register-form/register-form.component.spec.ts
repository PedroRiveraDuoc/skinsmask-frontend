import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RegisterFormComponent } from './register-form.component';
import { UserService } from '../../../core/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    const userServiceMock = jasmine.createSpyObj('UserService', ['register']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RegisterFormComponent],
      providers: [{ provide: UserService, useValue: userServiceMock }],
    });

    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize the form with default values', () => {
      const form = component.registerForm;
      expect(form.value).toEqual({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        roles: ['ROLE_USER'],
      });
    });
  });
});
