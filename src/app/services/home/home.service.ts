import { Location } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private location: Location = inject(Location);
  private router: Router = inject(Router);

  public goBack(): void {
    this.location.back();
  }

  public async navigateToRoute(path: string): Promise<void> {
    await this.router.navigate([`/home/${path}`]);
  }
}
