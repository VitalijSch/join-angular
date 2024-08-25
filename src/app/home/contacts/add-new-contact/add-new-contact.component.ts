import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HomeService } from '../../../services/home/home.service';

@Component({
  selector: 'app-add-new-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-new-contact.component.html',
  styleUrl: './add-new-contact.component.scss'
})
export class AddNewContactComponent {
  public homeService: HomeService = inject(HomeService);
}
