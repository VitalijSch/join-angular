import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FirebaseAuthenticationService } from '../services/firebase-authentication/firebase-authentication.service';
import { filter } from 'rxjs';
import { HomeService } from '../services/home/home.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,HeaderComponent, SidebarComponent, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  private firebaseAuthenticationService: FirebaseAuthenticationService = inject(FirebaseAuthenticationService);
  private router: Router = inject(Router);
  public homeService: HomeService = inject(HomeService);

  public async ngOnInit(): Promise<void> {
    await this.firebaseAuthenticationService.checkIfUserIsLogged();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.scrollToTop();
    });
  }

  private scrollToTop(): void {
    const container = this.scrollContainer.nativeElement;
    if (container) {
      container.scrollTo({ top: 0, behavior: 'auto' });
    }
  }
}
