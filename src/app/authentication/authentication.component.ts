import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss'
})
export class AuthenticationComponent {
  public authenticationService: AuthenticationService = inject(AuthenticationService);
  private router: Router = inject(Router);

  public ngOnInit(): void {
    this.authenticationService.handleAnimation();
  }

  public checkCurrentRoute(): boolean {
    if (this.router.url.includes('login')) {
      return true;
    } else {
      return false;
    }
  }
}
