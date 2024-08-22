import { inject, Injectable } from '@angular/core';
import { Auth, getAuth, signInAnonymously, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthenticationService {
  private auth: Auth = getAuth();

  private router: Router = inject(Router);

  private unsubscribe: (() => void) | undefined;

  public showErrorMessage: string = '';
  public showSuccessfullyMessage: boolean = false;

  public async registerWithEmailPassword(email: string, password: string): Promise<void> {
    try {
      this.showSuccessfullyMessage = true;
      await createUserWithEmailAndPassword(this.auth, email, password);
      await this.handleAnimationAndNavigation();
    } catch (error) {
      if (error) {
        if (error instanceof FirebaseError) {
          if (error.code === 'auth/email-already-in-use') {
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

  private handleErrorMessage(text: string): void {
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
      console.error('Fehler bei der anonymen Anmeldung:', error);
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
      await signOut(this.auth);
      await this.router.navigate(['/authentication/login']);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }

  public checkIfUserIsLogged(): void {
    this.unsubscribe = onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log('user is logged:', user);
      } else {
        console.log('user is logout');
        this.router.navigate(['/authentication/login']);
      }
    });
  }

  public ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
