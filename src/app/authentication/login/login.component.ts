import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { FirebaseAuthenticationService } from '../../services/firebase-authentication/firebase-authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public authenticationService: AuthenticationService = inject(AuthenticationService);
  public firebaseAuthenticationService: FirebaseAuthenticationService = inject(FirebaseAuthenticationService);
  private fb: FormBuilder = inject(FormBuilder);

  public userForm!: FormGroup;

  ngOnInit(): void {
    this.setupUserForm();
    this.resetPassword();
  }

  private setupUserForm(): void {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      password: ['', [Validators.required, Validators.pattern(/^.{8,}$/)]]
    });
  }

  public resetPassword(): void {
    if (this.userForm.get('password')?.value === '') {
      this.authenticationService.showPassword = false;
    }
    if (this.userForm.get('confirmPassword')?.value === '') {
      this.authenticationService.showConfirmPassword = false;
    }
  }

  public async loginAsUser(): Promise<void> {
    if (this.userForm.valid) {
      this.firebaseAuthenticationService.loginAsUser(this.userForm.get('email')?.value, this.userForm.get('password')?.value);
    }
  }

  public loginAsGuest(): void {
    this.firebaseAuthenticationService.loginAsGuest();
  }
}
