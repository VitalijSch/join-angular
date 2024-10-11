import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { SignupButtonComponent } from './signup-button/signup-button.component';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SignupButtonComponent],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss'
})
export class AuthenticationComponent {
  public authenticationService: AuthenticationService = inject(AuthenticationService);

  /**
   * Initializes the component when it is created.
   *
   * This method is called once the component has been initialized.
   * It triggers any animations related to the authentication service.
   *
   * @public
   * @returns {void}
   */
  public ngOnInit(): void {
    this.authenticationService.handleAnimation();
  }
}
