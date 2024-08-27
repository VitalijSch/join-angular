import { Component, inject } from '@angular/core';
import { AddNewContactComponent } from './add-new-contact/add-new-contact.component';
import { HomeService } from '../../services/home/home.service';
import { FirebaseDatabaseService } from '../../services/firebase-database/firebase-database.service';
import { CommonModule } from '@angular/common';
import { ContactsDataComponent } from "./contacts-data/contacts-data.component";

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [AddNewContactComponent, CommonModule, ContactsDataComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {
  public homeService: HomeService = inject(HomeService);
  public firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);

  public ngOnInit(): void {
    this.homeService.resetCurrentContact();
    this.sortContactsByName();
    this.firebaseDatabaseService.getLettersForContacts();
  }

  private sortContactsByName(): void {
    this.firebaseDatabaseService.contacts().sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }
}
