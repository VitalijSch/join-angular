import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { FirebaseAuthenticationService } from '../../services/firebase-authentication/firebase-authentication.service';
import { FirebaseDatabaseService } from '../../services/firebase-database/firebase-database.service';

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
  private firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);
  private fb: FormBuilder = inject(FormBuilder);

  public userForm!: FormGroup;

  public rememberMe: boolean = false;

  public async ngOnInit(): Promise<void> {
    this.setupUserForm();
    this.resetPassword();
    await this.firebaseDatabaseService.getUser();
    this.checkRememberMe(this.firebaseDatabaseService.user());
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

  private checkRememberMe(user: any): void {
    if (user !== null) {
      if (user.email !== '') {
        this.rememberMe = true;
        this.userForm.get('email')?.setValue(user.email);
        this.userForm.get('password')?.setValue(user.password);
      }
    } else {
      this.rememberMe = false;
      this.userForm.get('email')?.setValue('');
      this.userForm.get('password')?.setValue('');
    }
  }

  public toggleRememberMe(): void {
    this.rememberMe = !this.rememberMe;
  }

  public async loginAsUser(): Promise<void> {
    if (this.userForm.valid) {
      const email = this.userForm.get('email')?.value;
      const password = this.userForm.get('password')?.value;
      await this.handleRememberMe(email, password);
      await this.firebaseAuthenticationService.loginAsUser(email, password);
    }
  }

  private async handleRememberMe(email: string, password: string): Promise<void> {
    if (this.rememberMe) {
      const user = {
        email,
        password
      };
      await this.firebaseDatabaseService.addUser(user);
    } else {
      const user = this.firebaseDatabaseService.user();
      if (user?.id) {
        await this.firebaseDatabaseService.deleteUser(user.id);
      }
    }
  }

  public async loginAsGuest(): Promise<void> {
    await this.firebaseAuthenticationService.loginAsGuest();
  }
}
