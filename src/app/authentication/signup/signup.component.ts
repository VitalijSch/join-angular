import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { FirebaseAuthenticationService } from '../../services/firebase-authentication/firebase-authentication.service';
import { FirebaseDatabaseService } from '../../services/firebase-database/firebase-database.service';
import { ContactColorsService } from '../../services/contact-colors/contact-colors.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  public passwordsMatch: boolean = false;
  public isChecked: boolean = false;
  public showCheckboxFeedback: boolean = false;

  public userForm!: FormGroup;

  public authenticationService: AuthenticationService = inject(AuthenticationService);
  public firebaseAuthenticationService: FirebaseAuthenticationService = inject(FirebaseAuthenticationService);

  private firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);
  private contactColorsServie: ContactColorsService = inject(ContactColorsService);
  private location: Location = inject(Location);
  private fb: FormBuilder = inject(FormBuilder);

  public ngOnInit(): void {
    this.setupUserForm();
    this.resetPassword();
  }

  private setupUserForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-ZÄÖÜ][a-zA-ZäöüßÄÖÜ]+\s[A-ZÄÖÜ][a-zA-ZäöüßÄÖÜ]+$/)]],
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

  public toggleCheckbox(): void {
    this.isChecked = !this.isChecked;
  }

  public async createUser(): Promise<void> {
    const name = this.userForm.get('name')?.value;
    const email = this.userForm.get('email')?.value;
    const password = this.userForm.get('password')?.value;
    this.checkCheckbox();
    if (this.userForm.valid && this.isChecked && this.passwordsMatch) {
      await this.firebaseAuthenticationService.registerWithEmailPassword(name, email, password);
      const emailExists = this.firebaseDatabaseService.contacts.some(contact => contact.email === email);
      if (!emailExists) {
        await this.addContact(name, email);
      }
    }
  }

  public async addContact(name: string, email: string): Promise<void> {
    const contact = {
      name: name,
      email: email,
      phoneNumber: '',
      avatarLetters: this.getContactInitials(name),
      avatarColor: this.contactColorsServie.getRandomColor()
    }
    await this.firebaseDatabaseService.addContact(contact);
  }

  private checkPassword(): void {
    if (this.userForm.get('password')?.value === this.userForm.get('confirmPassword')?.value) {
      this.passwordsMatch = true;
    } else {
      this.passwordsMatch = false;
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

  private getContactInitials(name: string): string {
    const nameParts = name.split(' ');
    const initials = nameParts
      .map(part => part.charAt(0).toUpperCase())
      .join('');
    return initials;
  }
}
