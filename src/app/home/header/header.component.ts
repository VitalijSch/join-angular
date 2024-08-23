import { Component, inject } from '@angular/core';
import { FirebaseAuthenticationService } from '../../services/firebase-authentication/firebase-authentication.service';
import { FirebaseDatabaseService } from '../../services/firebase-database/firebase-database.service';
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
  public firebaseAuthenticationService: FirebaseAuthenticationService = inject(FirebaseAuthenticationService);
  public homeService: HomeService = inject(HomeService);
  public router: Router = inject(Router);

  public showDropdown: boolean = false;

  public toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  public handleLegalNavigation(path: string): void {
    this.toggleDropdown();
    this.homeService.navigateToRoute(`${path}`);
  }
}
