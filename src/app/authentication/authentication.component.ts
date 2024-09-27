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

  public ngOnInit(): void {
    this.authenticationService.handleAnimation();
  }
}
