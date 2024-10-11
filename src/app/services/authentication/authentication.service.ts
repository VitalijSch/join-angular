import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;
  public playAnimation: boolean = true;

  private router: Router = inject(Router);

  /**
 * Toggles the visibility of the password or confirm password input field.
 * If the `inputField` is 'password', it toggles the `showPassword` boolean.
 * Otherwise, it toggles the `showConfirmPassword` boolean.
 * 
 * @param {string} inputField - The input field to toggle ('password' or another string).
 */
  public togglePassword(inputField: string): void {
    if (inputField === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  /**
 * Handles animation by setting the `playAnimation` flag to false after a delay.
 * The delay is set for 1400 milliseconds.
 */
  public handleAnimation(): void {
    setTimeout(() => {
      this.playAnimation = false;
    }, 1400);
  }

  /**
 * Navigates to a specified route asynchronously.
 * Uses Angular's Router to navigate to the given `path`.
 * 
 * @param {string} path - The path to navigate to.
 * @returns {Promise<void>} - A promise that resolves once navigation is complete.
 */
  public async navigateToRoute(path: string): Promise<void> {
    await this.router.navigate([`${path}`]);
  }
}
