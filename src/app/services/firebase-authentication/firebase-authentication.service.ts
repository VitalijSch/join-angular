import { inject, Injectable } from '@angular/core';
import { Auth, getAuth, signInAnonymously, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, UserCredential } from "firebase/auth";
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthenticationService {
  public auth: Auth = getAuth();

  private router: Router = inject(Router);

  private unsubscribe: (() => void) | undefined;

  public showErrorMessage: string = '';
  public showSuccessfullyMessage: boolean = false;

  public async registerWithEmailPassword(name: string, email: string, password: string): Promise<void> {
    try {
      this.showSuccessfullyMessage = true;
      const userCredential: UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name
      });
      await this.handleAnimationAndNavigation();
    } catch (error) {
      if (error) {
        if (error instanceof FirebaseError) {
          if (error.code === 'auth/email-already-in-use') {
            this.showSuccessfullyMessage = false;
            this.handleErrorMessage('This email address is already taken.');
          }
        }
      }
    }
  }

  private async handleAnimationAndNavigation(): Promise<void> {
    setTimeout(async () => {
      this.showSuccessfullyMessage = false;
      await this.router.navigate(['/authentication/login']);
    }, 1000);
  }

  public handleErrorMessage(text: string): void {
    this.showErrorMessage = text;
    setTimeout(() => {
      this.showErrorMessage = '';
    }, 4000);
  }

  public async loginAsGuest(): Promise<void> {
    try {
      await signInAnonymously(this.auth);
      await this.router.navigate(['/home/summary']);
    } catch (error) {
      console.error('Error during anonymous login:', error);
    }
  }

  public async loginAsUser(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      await this.router.navigate(['/home/summary']);
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/invalid-credential') {
          this.handleErrorMessage('Check your email and password. Please try again.');
        } else {
          console.error('Error during user login:', error);
        }
      }
    }
  }

  public async logout(): Promise<void> {
    try {
      this.deleteAnonymUser();
      await this.router.navigate(['/authentication/login']);
      await signOut(this.auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }

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

  public getUserName(): string | undefined {
    const userName = this.auth.currentUser?.displayName;
    if (userName === null) {
      return 'Guest';
    } else {
      return userName;
    }
    ;
  }

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

  public async checkIfUserIsLogged(): Promise<void> {
    this.unsubscribe = onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        console.log('User is logged in:', user);
      } else {
        console.log('User is logged out');
        this.deleteAnonymUser();
        if (!this.router.url.includes('privacyPolicy') && !this.router.url.includes('legalNotice')) {
          await this.router.navigate(['/authentication/login']);
        }
      }
    });
  }

  public ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
