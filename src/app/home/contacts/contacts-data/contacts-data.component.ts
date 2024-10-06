import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HomeService } from '../../../services/home/home.service';
import { FirebaseDatabaseService } from '../../../services/firebase-database/firebase-database.service';

@Component({
  selector: 'app-contacts-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacts-data.component.html',
  styleUrl: './contacts-data.component.scss'
})
export class ContactsDataComponent {
  public homeService: HomeService = inject(HomeService);

  private firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);

  public async deleteContact(): Promise<void> {
    const indexOfContact = this.firebaseDatabaseService.contacts.findIndex(contact => contact.email === this.homeService.currentContact.email);
    const idOfContact = this.firebaseDatabaseService.contacts[indexOfContact].id;
    if (idOfContact) {
      this.homeService.resetCurrentContact();
      await this.firebaseDatabaseService.deleteContact(idOfContact);
    }
  }

  public toggleEditDeleteContainerMobile(): void {
    this.homeService.toggleEditContactContainer();
    console.log(this.homeService.showEditContactContainer)
    this.homeService.closeEditDeleteContainer();
  }
}
