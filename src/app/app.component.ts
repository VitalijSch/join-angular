import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HomeService } from './services/home/home.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public isLandscape: boolean = false;
  public isLargeEnough: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkOrientation();
  }

  public homeService: HomeService = inject(HomeService);

  public ngOnInit(): void {
    this.checkOrientation();
  }

  private checkOrientation(): void {
    this.isLandscape = window.matchMedia('(orientation: landscape)').matches;
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.isLargeEnough = width >= 600 && height >= 600; 
    if(this.isLargeEnough) {
      this.isLandscape = false;
    }
  }
}
