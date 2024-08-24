import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { FirebaseAuthenticationService } from '../../services/firebase-authentication/firebase-authentication.service';
import { EncryptionService } from '../../services/encryption/encryption.service';

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
  private encryptionService: EncryptionService = inject(EncryptionService);
  private fb: FormBuilder = inject(FormBuilder);

  public userForm!: FormGroup;

  public rememberMe: boolean = false;

  public async ngOnInit(): Promise<void> {
    this.setupUserForm();
    this.resetPassword();
    this.checkRememberMe();
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

  private checkRememberMe(): void {
    const encryptedEmail = localStorage.getItem('email');
    const encryptedPassword = localStorage.getItem('password');
    if (encryptedEmail && encryptedPassword) {
      this.rememberMe = true;
      this.decryptLoginData();
    } else {
      this.rememberMe = false;
      this.userForm.get('email')?.setValue('');
      this.userForm.get('password')?.setValue('');
    }
  }

  private decryptLoginData(): void {
    const encryptedEmail = localStorage.getItem('email');
    const encryptedPassword = localStorage.getItem('password');
    if (encryptedEmail && encryptedPassword) {
      const email = this.encryptionService.decrypt(encryptedEmail);
      const password = this.encryptionService.decrypt(encryptedPassword);
      this.userForm.get('email')?.setValue(email);
      this.userForm.get('password')?.setValue(password);
    } else {
      console.error('No encrypted data found in localStorage');
    }
  }

  public toggleRememberMe(): void {
    this.rememberMe = !this.rememberMe;
  }

  public async loginAsUser(): Promise<void> {
    if (this.userForm.valid) {
      const email = this.userForm.get('email')?.value;
      const password = this.userForm.get('password')?.value;
      this.handleRememberMe(email, password);
      await this.firebaseAuthenticationService.loginAsUser(email, password);
    }
  }

  private handleRememberMe(email: string, password: string): void {
    if (this.rememberMe) {
      this.encryptLoginData(email, password);
    } else {
      this.removeLoginDataFromLocalStorage();
    }
  }

  private encryptLoginData(email: string, password: string): void {
    const encryptedEmail = this.encryptionService.encrypt(email);
    const encryptedPassword = this.encryptionService.encrypt(password);
    localStorage.setItem('email', encryptedEmail);
    localStorage.setItem('password', encryptedPassword);
  }

  private removeLoginDataFromLocalStorage(): void {
    const encryptedEmail = localStorage.getItem('email');
    const encryptedPassword = localStorage.getItem('password');
    if (encryptedEmail && encryptedPassword) {
      localStorage.removeItem('email');
      localStorage.removeItem('password');
    }
  }

  public async loginAsGuest(): Promise<void> {
    if (!this.rememberMe) {
      this.removeLoginDataFromLocalStorage();
    }
    await this.firebaseAuthenticationService.loginAsGuest();
  }
}
