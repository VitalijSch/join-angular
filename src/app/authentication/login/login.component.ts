import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb: FormBuilder = inject(FormBuilder);

  public userForm!: FormGroup;

  public isChecked: boolean = false;

  ngOnInit(): void {
    this.setupUserForm();
  }

  private setupUserForm(): void {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      password: ['', [Validators.required, Validators.pattern(/^.{8,}$/)]],
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  public toggleCheckbox(): void {
    this.isChecked = !this.isChecked;
  }

  public loginAsUser(): void {

  }

  public loginAsGuest(): void {

  }
}
