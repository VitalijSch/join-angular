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
  public playAnimation: boolean = false;

  ngOnInit(): void {
    this.handleAnimation();
  }

  private handleAnimation(): void {
    if (this.router.url.includes('login')) {
      this.playAnimation = true;
      setTimeout(() => {
        this.playAnimation = false;
      }, 2000);
    }
  }

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
