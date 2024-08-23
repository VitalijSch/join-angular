import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../../services/home/home.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  public homeService: HomeService = inject(HomeService);
  public router: Router = inject(Router);

  public currentUrl(path: string): string {
    if (this.router.url.includes(`${path}`)) {
      return `${path}`;
    } else {
      return '';
    }
  }
}
