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

  /**
   * Lifecycle hook that is called after data-bound properties of a component are initialized.
   * This method sets up the user form and resets the password visibility flags.
   *
   * @public
   * @returns {void}
   */
  public ngOnInit(): void {
    this.setupUserForm();
    this.resetPassword();
  }

  /**
  * Sets up the user form with validation rules.
  * The form includes fields for name, email, password, and confirm password.
  *
  * @private
  * @returns {void}
  */
  private setupUserForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-ZÄÖÜ][a-zA-ZäöüßÄÖÜ]+\s[A-ZÄÖÜ][a-zA-ZäöüßÄÖÜ]+$/)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      password: ['', [Validators.required, Validators.pattern(/^.{8,}$/)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(/^.{8,}$/)]]
    });
  }

  /**
  * Navigates back to the previous page in the history stack.
  *
  * @public
  * @returns {void}
  */
  public goBack(): void {
    this.location.back();
  }

  /**
  * Resets the password visibility flags based on the user form inputs.
  * It checks if the password and confirm password fields are empty and updates the visibility flags accordingly.
  *
  * @public
  * @returns {void}
  */
  public resetPassword(): void {
    this.checkPassword();
    if (this.userForm.get('password')?.value === '') {
      this.authenticationService.showPassword = false;
    }
    if (this.userForm.get('confirmPassword')?.value === '') {
      this.authenticationService.showConfirmPassword = false;
    }
  }

  /**
  * Toggles the checkbox state for the user agreement.
  *
  * @public
  * @returns {void}
  */
  public toggleCheckbox(): void {
    this.isChecked = !this.isChecked;
  }

  /**
  * Creates a new user with the provided details from the user form.
  * This method registers the user and adds them as a contact if they do not already exist.
  *
  * @public
  * @returns {Promise<void>} - A promise that resolves when the user creation process is complete.
  */
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

  /**
  * Adds a contact with the specified name and email to the database.
  *
  * @public
  * @param {string} name - The name of the contact to add.
  * @param {string} email - The email of the contact to add.
  * @returns {Promise<void>} - A promise that resolves when the contact is added.
  */
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

  /**
  * Checks if the password and confirm password fields match.
  * Sets the passwordsMatch flag based on the comparison.
  *
  * @private
  * @returns {void}
  */
  private checkPassword(): void {
    if (this.userForm.get('password')?.value === this.userForm.get('confirmPassword')?.value) {
      this.passwordsMatch = true;
    } else {
      this.passwordsMatch = false;
    }
  }

  /**
  * Checks if the user has agreed to the terms by checking the checkbox.
  * Displays feedback if the checkbox is not checked.
  *
  * @private
  * @returns {void}
  */
  private checkCheckbox(): void {
    if (!this.isChecked) {
      this.showCheckboxFeedback = true;
      setTimeout(() => {
        this.showCheckboxFeedback = false;
      }, 2000);
    }
  }

  /**
  * Generates initials from the provided name by taking the first letter of each part of the name.
  *
  * @private
  * @param {string} name - The full name from which to generate initials.
  * @returns {string} - The generated initials as a string.
  */
  private getContactInitials(name: string): string {
    const nameParts = name.split(' ');
    const initials = nameParts
      .map(part => part.charAt(0).toUpperCase())
      .join('');
    return initials;
  }
}
