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
  public rememberMe: boolean = false;

  public userForm!: FormGroup;

  public authenticationService: AuthenticationService = inject(AuthenticationService);
  public firebaseAuthenticationService: FirebaseAuthenticationService = inject(FirebaseAuthenticationService);

  private encryptionService: EncryptionService = inject(EncryptionService);
  private fb: FormBuilder = inject(FormBuilder);

  /**
   * Lifecycle hook that is called after the component's view has been fully initialized.
   * This method sets up the user form, resets the password visibility, and checks if the "Remember Me" option is enabled.
   *
   * @public
   * @returns {Promise<void>}
   */
  public async ngOnInit(): Promise<void> {
    this.setupUserForm();
    this.resetPassword();
    this.checkRememberMe();
  }

  /**
  * Sets up the user form with validation rules for email and password fields.
  *
  * @private
  * @returns {void}
  */
  private setupUserForm(): void {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      password: ['', [Validators.required, Validators.pattern(/^.{8,}$/)]]
    });
  }

  /**
  * Resets the password visibility flags based on the user form inputs.
  * Hides the password fields if they are empty.
  *
  * @public
  * @returns {void}
  */
  public resetPassword(): void {
    if (this.userForm.get('password')?.value === '') {
      this.authenticationService.showPassword = false;
    }
    if (this.userForm.get('confirmPassword')?.value === '') {
      this.authenticationService.showConfirmPassword = false;
    }
  }

  /**
  * Toggles the state of the "Remember Me" checkbox.
  *
  * @public
  * @returns {void}
  */
  public toggleRememberMe(): void {
    this.rememberMe = !this.rememberMe;
  }

  /**
  * Logs in the user with the provided email and password if the form is valid.
  * Handles the "Remember Me" functionality by saving or removing login data accordingly.
  *
  * @public
  * @returns {Promise<void>} - A promise that resolves when the login process is complete.
  */
  public async loginAsUser(): Promise<void> {
    if (this.userForm.valid) {
      const email = this.userForm.get('email')?.value;
      const password = this.userForm.get('password')?.value;
      this.handleRememberMe(email, password);
      await this.firebaseAuthenticationService.loginAsUser(email, password);
    }
  }

  /**
  * Logs in as a guest user.
  * Removes any saved login data if "Remember Me" is not checked.
  *
  * @public
  * @returns {Promise<void>} - A promise that resolves when the guest login process is complete.
  */
  public async loginAsGuest(): Promise<void> {
    if (!this.rememberMe) {
      this.removeLoginDataFromLocalStorage();
    }
    await this.firebaseAuthenticationService.loginAsGuest();
  }

  /**
  * Checks if the "Remember Me" option was previously set.
  * If so, it decrypts and populates the email and password fields in the form.
  *
  * @private
  * @returns {void}
  */
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

  /**
  * Decrypts the login data stored in local storage and populates the user form fields with the decrypted values.
  *
  * @private
  * @returns {void}
  */
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

  /**
  * Handles the "Remember Me" functionality by either saving the login data to local storage
  * or removing it based on the checkbox state.
  *
  * @private
  * @param {string} email - The email entered by the user.
  * @param {string} password - The password entered by the user.
  * @returns {void}
  */
  private handleRememberMe(email: string, password: string): void {
    if (this.rememberMe) {
      this.encryptLoginData(email, password);
    } else {
      this.removeLoginDataFromLocalStorage();
    }
  }

  /**
  * Encrypts the login data (email and password) and stores it in local storage.
  *
  * @private
  * @param {string} email - The email to encrypt and store.
  * @param {string} password - The password to encrypt and store.
  * @returns {void}
  */
  private encryptLoginData(email: string, password: string): void {
    const encryptedEmail = this.encryptionService.encrypt(email);
    const encryptedPassword = this.encryptionService.encrypt(password);
    localStorage.setItem('email', encryptedEmail);
    localStorage.setItem('password', encryptedPassword);
  }

  /**
  * Removes the login data (email and password) from local storage.
  *
  * @private
  * @returns {void}
  */
  private removeLoginDataFromLocalStorage(): void {
    const encryptedEmail = localStorage.getItem('email');
    const encryptedPassword = localStorage.getItem('password');
    if (encryptedEmail && encryptedPassword) {
      localStorage.removeItem('email');
      localStorage.removeItem('password');
    }
  }
}
