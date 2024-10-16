import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signup-button.component.html',
  styleUrl: './signup-button.component.scss'
})
export class SignupButtonComponent {
  public authenticationService: AuthenticationService = inject(AuthenticationService);

  private router: Router = inject(Router);

  /**
   * Checks if the current route is the login page.
   *
   * This method examines the current URL and returns true if it includes
   * 'login', indicating that the user is on the login page; otherwise, it returns false.
   *
   * @public
   * @returns {boolean} - Returns true if the current route is the login page, false otherwise.
   */
  public checkCurrentRoute(): boolean {
    if (this.router.url.includes('login')) {
      return true;
    } else {
      return false;
    }
  }
}
