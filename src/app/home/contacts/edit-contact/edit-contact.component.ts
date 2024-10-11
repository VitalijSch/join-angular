import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HomeService } from '../../../services/home/home.service';
import { FirebaseAuthenticationService } from '../../../services/firebase-authentication/firebase-authentication.service';
import { FirebaseDatabaseService } from '../../../services/firebase-database/firebase-database.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Contact } from '../../../interfaces/contact';

@Component({
  selector: 'app-edit-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-contact.component.html',
  styleUrl: './edit-contact.component.scss'
})
export class EditContactComponent {
  public contactForm!: FormGroup;

  public homeService: HomeService = inject(HomeService);
  public firebaseAuthenticationService: FirebaseAuthenticationService = inject(FirebaseAuthenticationService);

  private firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);
  private fb: FormBuilder = inject(FormBuilder);

  /**
   * Initializes the component by setting up the contact form with current contact information.
   *
   * This method is called once the component is initialized and prepares the form
   * controls for name, email, and phone number using the current contact's details.
   */
  public ngOnInit(): void {
    this.setupContactForm();
  }

  /**
  * Sets up the contact form with the necessary form controls and validators.
  * The form contains fields for name, email, and phone number, pre-filled with
  * the current contact's information from the home service.
  */
  private setupContactForm(): void {
    this.contactForm = this.fb.group({
      name: [this.homeService.currentContact.name, [Validators.required, Validators.pattern(/^[A-ZÄÖÜ][a-zA-ZäöüßÄÖÜ]+\s[A-ZÄÖÜ][a-zA-ZäöüßÄÖÜ]+$/)]],
      email: [this.homeService.currentContact.email, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      phoneNumber: [this.homeService.currentContact.phoneNumber, [Validators.pattern(/^\+?[0-9]{7,15}$/)]]
    });
  }

  /**
  * Deletes the current contact from the database.
  *
  * This method finds the contact in the contact list based on the email,
  * resets the current contact, toggles the edit contact container,
  * and calls the delete function from the Firebase database service.
  *
  * @returns {Promise<void>} A promise that resolves when the contact has been deleted.
  */
  public async deleteContact(): Promise<void> {
    const indexOfContact = this.firebaseDatabaseService.contacts.findIndex(contact => contact.email === this.homeService.currentContact.email);
    const idOfContact = this.firebaseDatabaseService.contacts[indexOfContact].id;
    if (idOfContact) {
      this.homeService.resetCurrentContact();
      this.homeService.toggleEditContactContainer();
      await this.firebaseDatabaseService.deleteContact(idOfContact);
    }
  }

  /**
  * Updates the current contact's information in the database.
  *
  * This method checks if any contact details have changed and if the form is valid.
  * If so, it updates the contact in the database and updates the current contact
  * in the home service.
  *
  * @returns {Promise<void>} A promise that resolves when the contact has been updated.
  */
  public async updateContact(): Promise<void> {
    const name = this.contactForm.get('name')?.value;
    const email = this.contactForm.get('email')?.value;
    const phoneNumber = this.contactForm.get('phoneNumber')?.value;
    if (this.hasContactChanged(name, email, phoneNumber) && this.contactForm.valid) {
      const indexOfContact = this.firebaseDatabaseService.contacts.findIndex(contact => contact.email === this.homeService.currentContact.email);
      await this.firebaseDatabaseService.updateContact(this.editContact(name, email, phoneNumber, indexOfContact));
      this.homeService.currentContact = this.firebaseDatabaseService.contacts[indexOfContact];
    }
    this.homeService.toggleEditContactContainer();
  }

  /**
  * Checks if the current contact's details have changed.
  *
  * @param {string} name - The new name of the contact.
  * @param {string} email - The new email of the contact.
  * @param {string} phoneNumber - The new phone number of the contact.
  * @returns {boolean} True if the contact details have changed; otherwise, false.
  */
  private hasContactChanged(name: string, email: string, phoneNumber: string): boolean {
    return this.homeService.currentContact.name !== name ||
      this.homeService.currentContact.email !== email ||
      this.homeService.currentContact.phoneNumber !== phoneNumber;
  }

  /**
  * Edits the contact's details based on the provided information.
  *
  * This method updates the current contact object with the new values
  * for name, email, and phone number and generates new initials for the contact.
  *
  * @param {string} name - The new name of the contact.
  * @param {string} email - The new email of the contact.
  * @param {string | number} phoneNumber - The new phone number of the contact.
  * @param {number} indexOfContact - The index of the contact in the contacts array.
  * @returns {Contact} The updated contact object.
  */
  private editContact(name: string, email: string, phoneNumber: string | number, indexOfContact: number): Contact {
    this.firebaseDatabaseService.contacts[indexOfContact].name = name;
    this.firebaseDatabaseService.contacts[indexOfContact].email = email;
    this.firebaseDatabaseService.contacts[indexOfContact].phoneNumber = phoneNumber;
    this.firebaseDatabaseService.contacts[indexOfContact].avatarLetters = this.getContactInitials(name);
    const currentContact = this.firebaseDatabaseService.contacts[indexOfContact];
    return currentContact;
  }

  /**
  * Generates initials from the contact's name.
  *
  * @param {string} name - The full name of the contact.
  * @returns {string} The initials derived from the contact's name.
  */
  private getContactInitials(name: string): string {
    const nameParts = name.split(' ');
    const initials = nameParts
      .map(part => part.charAt(0).toUpperCase())
      .join('');
    return initials;
  }
}