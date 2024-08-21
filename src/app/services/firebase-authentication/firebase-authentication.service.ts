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

  public showErrorMessage: string = '';
  public showSuccessfullyMessage: boolean = false;

  public async registerWithEmailPassword(email: string, password: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      this.handleAnimationAndNavigation();
      const user = userCredential.user;
      console.log("User created: ", user);
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

  public loginAsGuest(): void {
    signInAnonymously(this.auth)
      .then(() => {
        console.log('login as guest');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  public loginAsUser(email: string, password: string): void {
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        console.log('user logged:', userCredential.user);
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-credential') {
          this.handleErrorMessage('Check your email and password. Please try again.');
        }
      });
  }

  public logout() {
    signOut(this.auth)
      .then(() => {
        console.log("User signed out");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  }

  public checkIfUserIsLogged(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log('user is logged:', user);
      } else {
        console.log('user is logout');
        this.router.navigate(['/authentication/login']);
      }
    });
  }

  private handleAnimationAndNavigation(): void {
    this.showSuccessfullyMessage = true;
    setTimeout(() => {
      this.showSuccessfullyMessage = false;
      this.router.navigate(['/authentication/login']);
    }, 1000);
  }

  private handleErrorMessage(text: string): void {
    this.showErrorMessage = text;
    setTimeout(() => {
      this.showErrorMessage = '';
    }, 4000);
  }
}
