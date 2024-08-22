import { inject, Injectable } from '@angular/core';
import { Auth, getAuth, signInAnonymously, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import { FirebaseDatabaseService } from '../firebase-database/firebase-database.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthenticationService {
  private auth: Auth = getAuth();

  private router: Router = inject(Router);
  private firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);

  public showErrorMessage: string = '';
  public showSuccessfullyMessage: boolean = false;
  public rememberMe: boolean = false;

  public toggleRememberMe(): void {
    this.rememberMe = !this.rememberMe;
  }

  public async registerWithEmailPassword(email: string, password: string): Promise<void> {
    try {
      this.showSuccessfullyMessage = true;
      await createUserWithEmailAndPassword(this.auth, email, password);
      this.handleAnimationAndNavigation();
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

  private handleAnimationAndNavigation(): void {
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

  public loginAsGuest(): void {
    signInAnonymously(this.auth)
      .then(() => {
        if (!this.rememberMe) {
          this.deleteUser();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  public async loginAsUser(email: string, password: string): Promise<void> {
    signInWithEmailAndPassword(this.auth, email, password)
      .then(async (userCredential) => {
        await this.handleRememberMe(email, password);
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-credential') {
          this.handleErrorMessage('Check your email and password. Please try again.');
        }
      });
  }

  private async handleRememberMe(email: string, password: string): Promise<void> {
    if (this.rememberMe) {
      const user = {
        email,
        password
      };
      await this.firebaseDatabaseService.addUser(user);
    } else {
      this.deleteUser();
    }
  }

  private deleteUser(): void {
    this.firebaseDatabaseService.user$.subscribe(async user => {
      if (user?.id) {
        await this.firebaseDatabaseService.deleteUser(user.id);
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
}
