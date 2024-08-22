import { Component, inject } from '@angular/core';
import { HomeService } from '../../services/home/home.service';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss'
})
export class HelpComponent {
  public homeService: HomeService = inject(HomeService);
}
