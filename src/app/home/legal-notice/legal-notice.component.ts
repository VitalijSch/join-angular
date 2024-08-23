import { Component, inject } from '@angular/core';
import { HomeService } from '../../services/home/home.service';

@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss'
})
export class LegalNoticeComponent {
  public homeService: HomeService = inject(HomeService);
}
