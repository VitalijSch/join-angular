import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../../services/home/home.service';
import { FirebaseAuthenticationService } from '../../services/firebase-authentication/firebase-authentication.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  public homeService: HomeService = inject(HomeService);
  public firebaseAuthenticationService: FirebaseAuthenticationService = inject(FirebaseAuthenticationService);
  public router: Router = inject(Router);

  /**
   * Checks if the current router URL includes the specified path.
   *
   * This method compares the current router URL with the provided path.
   * If the current URL contains the specified path, it returns the path;
   * otherwise, it returns an empty string.
   *
   * @param {string} path - The path to check against the current URL.
   * @returns {string} The specified path if it is found in the current URL; otherwise, an empty string.
   */
  public currentUrl(path: string): string {
    if (this.router.url.includes(`${path}`)) {
      return `${path}`;
    } else {
      return '';
    }
  }
}
