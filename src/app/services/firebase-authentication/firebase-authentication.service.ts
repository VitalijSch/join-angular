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
        console.log('login as user', userCredential);
      })
      .catch((error) => {
        console.error("Error signing in: ", error);
        if (error === 'auth/invalid-credential') {
          this.showErrorMessage = 'Check your email and password. Please try again.';
          setTimeout(() => {
            this.showErrorMessage = '';
          }, 4000);
        }
      });
  }

  public logout() {
    signOut(this.auth)
      .then(() => {
        // if (this.user.name !== 'Guest') {
        //   this.user.isOnline = false;
        // }
        console.log("User signed out");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  }

  public async registerWithEmailPassword(name: string, email: string, password: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      console.log("User created: ", user);
    } catch (error) {
      if (error) {
        if (error instanceof FirebaseError) {
          if (error.code === 'auth/email-already-in-use') {
            this.showErrorMessage = 'This email address is already taken.';
            setTimeout(() => {
              this.showErrorMessage = '';
            }, 4000);
          }
        }
      }
    }
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
}
