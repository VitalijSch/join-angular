import { Component, inject } from '@angular/core';
import { FirebaseAuthenticationService } from '../../services/firebase-authentication/firebase-authentication.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../services/home/home.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public showDropdown: boolean = false;

  public firebaseAuthenticationService: FirebaseAuthenticationService = inject(FirebaseAuthenticationService);
  public homeService: HomeService = inject(HomeService);
  public router: Router = inject(Router);

  /**
   * Toggles the visibility of the dropdown menu.
   *
   * This method switches the value of the `showDropdown` property between true and false,
   * effectively showing or hiding the dropdown menu.
   */
  public toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  /**
  * Handles the navigation to a specified legal path and toggles the dropdown menu.
  *
  * This method first toggles the dropdown visibility and then navigates to the specified path
  * using the home service's navigation method.
  *
  * @param {string} path - The path to navigate to.
  */
  public handleLegalNavigation(path: string): void {
    this.toggleDropdown();
    this.homeService.navigateToRoute(`${path}`);
  }
}
