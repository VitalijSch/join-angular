import { Component, inject } from '@angular/core';
import { FirebaseAuthenticationService } from '../../services/firebase-authentication/firebase-authentication.service';
import { FirebaseDatabaseService } from '../../services/firebase-database/firebase-database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public firebaseAuthenticationService: FirebaseAuthenticationService = inject(FirebaseAuthenticationService);
  private router: Router = inject(Router);

  public showDropdown: boolean = false;

  public toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  public async showHelpComponent(): Promise<void> {
    await this.router.navigate(['/home/help']);
  }
}
