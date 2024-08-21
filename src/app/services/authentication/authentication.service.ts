import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;

  public togglePassword(inputField: string): void {
    if (inputField === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
}
