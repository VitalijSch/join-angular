import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { FirebaseAuthenticationService } from '../../services/firebase-authentication/firebase-authentication.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  public authenticationService: AuthenticationService = inject(AuthenticationService);
  public firebaseAuthenticationService: FirebaseAuthenticationService = inject(FirebaseAuthenticationService);
  private location: Location = inject(Location);
  private fb: FormBuilder = inject(FormBuilder);

  public userForm!: FormGroup;

  public passwordsMatch: boolean = false;
  public isChecked: boolean = false;
  public showCheckboxFeedback: boolean = false;

  ngOnInit(): void {
    this.setupUserForm();
    this.resetPassword();
  }

  private setupUserForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Z][a-zA-Z]+\s[A-Z][a-zA-Z]+$/)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      password: ['', [Validators.required, Validators.pattern(/^.{8,}$/)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(/^.{8,}$/)]]
    });
  }

  public goBack(): void {
    this.location.back();
  }

  public resetPassword(): void {
    this.checkPassword();
    if (this.userForm.get('password')?.value === '') {
      this.authenticationService.showPassword = false;
    }
    if (this.userForm.get('confirmPassword')?.value === '') {
      this.authenticationService.showConfirmPassword = false;
    }
  }

  private checkPassword(): void {
    if (this.userForm.get('password')?.value === this.userForm.get('confirmPassword')?.value) {
      this.passwordsMatch = true;
    } else {
      this.passwordsMatch = false;
    }
  }

  public toggleCheckbox(): void {
    this.isChecked = !this.isChecked;
  }

  public async createUser(): Promise<void> {
    this.checkCheckbox();
    if (this.userForm.valid && this.isChecked && this.passwordsMatch) {
      await this.firebaseAuthenticationService.registerWithEmailPassword(this.userForm.get('email')?.value, this.userForm.get('password')?.value);
    }
  }

  private checkCheckbox(): void {
    if (!this.isChecked) {
      this.showCheckboxFeedback = true;
      setTimeout(() => {
        this.showCheckboxFeedback = false;
      }, 2000);
    }
  }
}
