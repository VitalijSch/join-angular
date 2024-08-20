import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss'
})
export class AuthenticationComponent {
  private router: Router = inject(Router);

  public goToSignup(): void {
    this.router.navigate(['/authentication/signup']);
  }

  public checkCurrentRoute(): boolean {
    if (this.router.url.includes('login')) {
      return true;
    } else {
      return false;
    }
  }
}
