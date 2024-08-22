import { Location } from '@angular/common';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private location: Location = inject(Location);

  public goBack(): void {
    this.location.back();
  }
}
