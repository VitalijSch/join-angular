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

  /**
   * Deletes the current contact from the database.
   *
   * This method searches for the contact in the contacts list using the email
   * of the current contact. If the contact is found, it resets the current contact
   * in the home service and calls the delete function from the Firebase database service
   * to remove the contact based on its ID.
   *
   * @returns {Promise<void>} A promise that resolves when the contact has been successfully deleted.
   * @throws {Error} Throws an error if the contact cannot be deleted due to network issues or
   *                 if the contact does not exist.
   */
  public async deleteContact(): Promise<void> {
    const indexOfContact = this.firebaseDatabaseService.contacts.findIndex(contact => contact.email === this.homeService.currentContact.email);
    const idOfContact = this.firebaseDatabaseService.contacts[indexOfContact].id;
    if (idOfContact) {
      this.homeService.resetCurrentContact();
      await this.firebaseDatabaseService.deleteContact(idOfContact);
    }
  }
}
