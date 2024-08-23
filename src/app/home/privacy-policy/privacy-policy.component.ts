import { Component, inject } from '@angular/core';
import { HomeService } from '../../services/home/home.service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {
  public homeService: HomeService = inject(HomeService);
}
