import { inject, Injectable } from '@angular/core';
import { Auth, getAuth, signInAnonymously, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, UserCredential } from "firebase/auth";
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthenticationService {
  public showErrorMessage: string = '';
  public showSuccessfullyMessage: boolean = false;

  public auth: Auth = getAuth();

  private router: Router = inject(Router);

  private unsubscribe: (() => void) | undefined;

  /**
   * Cleans up resources and subscriptions when the component is destroyed.
   * Unsubscribes from any observable if it exists.
   */
  public ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  /**
   * Registers a new user with email and password.
   * 
   * @param {string} name - The name of the user.
   * @param {string} email - The email address of the user.
   * @param {string} password - The password for the user account.
   * @returns {Promise<void>} - A promise that resolves when the registration is complete.
   */
  public async registerWithEmailPassword(name: string, email: string, password: string): Promise<void> {
    try {
      await this.registerUser(name, email, password);
    } catch (error) {
      this.registerUserError(error);
    }
  }

  /**
   * Displays an error message for a short duration.
   * The error message will be cleared after 4000 milliseconds.
   * 
   * @param {string} text - The error message to display.
   */
  public handleErrorMessage(text: string): void {
    this.showErrorMessage = text;
    setTimeout(() => {
      this.showErrorMessage = '';
    }, 4000);
  }

  /**
   * Logs in a user anonymously and navigates to the summary page.
   * 
   * @returns {Promise<void>} - A promise that resolves when the login is complete.
   */
  public async loginAsGuest(): Promise<void> {
    try {
      await signInAnonymously(this.auth);
      await this.router.navigate(['/home/summary']);
    } catch (error) {
      console.error('Error during anonymous login:', error);
    }
  }

  /**
   * Logs in a user with email and password.
   * 
   * @param {string} email - The email address of the user.
   * @param {string} password - The password for the user account.
   * @returns {Promise<void>} - A promise that resolves when the login is complete.
   */
  public async loginAsUser(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      await this.router.navigate(['/home/summary']);
    } catch (error) {
      this.loginAsUserError(error);
    }
  }

  /**
   * Logs out the current user and navigates to the login page.
   * Deletes the anonymous user if applicable.
   * 
   * @returns {Promise<void>} - A promise that resolves when the logout is complete.
   */
  public async logout(): Promise<void> {
    try {
      await this.deleteAnonymUser();
      await this.router.navigate(['/authentication/login']);
      await signOut(this.auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }

  /**
   * Retrieves the display name of the current user.
   * If the user is not logged in, it returns 'Guest'.
   * 
   * @returns {string | undefined} - The user's display name or 'Guest' if not available.
   */
  public getUserName(): string | undefined {
    const userName = this.auth.currentUser?.displayName;
    if (userName === null) {
      return 'Guest';
    } else {
      return userName;
    }
  }

  /**
   * Retrieves the initials of the current user based on their display name.
   * If the user is not logged in, returns 'G'.
   * 
   * @returns {string} - The initials of the user or 'G' if not available.
   */
  public getUserInitials(): string {
    const userName = this.auth.currentUser?.displayName;
    if (!userName) {
      return 'G';
    }
    const nameParts = userName.split(' ');
    const initials = nameParts
      .map(part => part.charAt(0).toUpperCase())
      .join('');
    return initials;
  }

  /**
   * Checks if the user is logged in and navigates to the login page if not.
   * Unsubscribes from the authentication state listener on component destruction.
   * 
   * @returns {Promise<void>} - A promise that resolves when the check is complete.
   */
  public async checkIfUserIsLogged(): Promise<void> {
    this.unsubscribe = onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        // User is logged in
      } else {
        this.deleteAnonymUser();
        if (!this.router.url.includes('privacyPolicy') && !this.router.url.includes('legalNotice')) {
          await this.router.navigate(['/authentication/login']);
        }
      }
    });
  }

  /**
   * Handles errors that occur during user login.
   * Displays an appropriate error message based on the error code.
   * 
   * @param {unknown} error - The error that occurred during login.
   */
  private loginAsUserError(error: unknown): void {
    if (error instanceof FirebaseError) {
      if (error.code === 'auth/invalid-credential') {
        this.handleErrorMessage('Check your email and password. Please try again.');
      } else {
        console.error('Error during user login:', error);
      }
    }
  }

  /**
   * Deletes the anonymous user if they are currently logged in.
   * 
   * @returns {Promise<void>} - A promise that resolves when the deletion is complete.
   */
  private async deleteAnonymUser(): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (user && user.isAnonymous) {
        await user.delete();
        console.log("Anonymous user has been deleted.");
      }
    } catch (error) {
      console.error("Failed to delete anonymous user: ", error);
    }
  }

  /**
   * Registers a new user and updates their profile with the given name.
   * 
   * @param {string} name - The name of the user.
   * @param {string} email - The email address of the user.
   * @param {string} password - The password for the user account.
   * @returns {Promise<void>} - A promise that resolves when the registration is complete.
   */
  private async registerUser(name: string, email: string, password: string): Promise<void> {
    this.showSuccessfullyMessage = true;
    const userCredential: UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    await updateProfile(userCredential.user, {
      displayName: name
    });
    await this.handleAnimationAndNavigation();
  }

  /**
   * Handles errors that occur during user registration.
   * Displays an appropriate error message based on the error code.
   * 
   * @param {unknown} error - The error that occurred during registration.
   */
  private registerUserError(error: unknown): void {
    if (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use') {
          this.showSuccessfullyMessage = false;
          this.handleErrorMessage('This email address is already taken.');
        }
      }
    }
  }

  /**
   * Handles animation and navigates to the login page after a delay.
   * 
   * @returns {Promise<void>} - A promise that resolves when the navigation is complete.
   */
  private async handleAnimationAndNavigation(): Promise<void> {
    setTimeout(async () => {
      this.showSuccessfullyMessage = false;
      await this.router.navigate(['/authentication/login']);
    }, 1000);
  }
}
