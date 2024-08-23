import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private router: Router = inject(Router);

  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;
  public playAnimation: boolean = true;

  public togglePassword(inputField: string): void {
    if (inputField === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  public handleAnimation(): void {
    setTimeout(() => {
      this.playAnimation = false;
    }, 2000);
  }

  public async navigateToRoute(path: string): Promise<void> {
    await this.router.navigate([`${path}`]);
  }
}
