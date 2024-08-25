import { Component, inject } from '@angular/core';
import { AddNewContactComponent } from './add-new-contact/add-new-contact.component';
import { HomeService } from '../../services/home/home.service';
import { FirebaseDatabaseService } from '../../services/firebase-database/firebase-database.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [AddNewContactComponent, CommonModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {
  public homeService: HomeService = inject(HomeService);
  public firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);

  public alphabet: string[] = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y', 'Z'
  ];

  public ngOnInit(): void {
    this.firebaseDatabaseService.getContact();
  }
}
