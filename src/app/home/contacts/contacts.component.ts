import { Component, inject } from '@angular/core';
import { AddNewContactComponent } from './add-new-contact/add-new-contact.component';
import { HomeService } from '../../services/home/home.service';
import { FirebaseDatabaseService } from '../../services/firebase-database/firebase-database.service';
import { CommonModule } from '@angular/common';
import { ContactsDataComponent } from "./contacts-data/contacts-data.component";
import { EditContactComponent } from './edit-contact/edit-contact.component';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [AddNewContactComponent, CommonModule, ContactsDataComponent, EditContactComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {
  public homeService: HomeService = inject(HomeService);
  public firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);

  public ngOnInit(): void {
    this.homeService.resetCurrentContact();
  }
}
