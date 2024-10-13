import { Location } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Contact } from '../../interfaces/contact';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  public showAddNewContactContainer: boolean = false;
  public showAddNewContactAnimation: boolean = false;

  public showEditContactContainer: boolean = false;
  public showEditContactAnimation: boolean = false;

  public showEditDeleteContainer: boolean = false;

  public closeAddContactAnimation: boolean = false;

  public disabledElement: boolean = false;

  public showSummaryAnimation: boolean = false;

  public currentContact: Contact = {
    name: '',
    email: '',
    phoneNumber: '',
    avatarLetters: '',
    avatarColor: ''
  };

  private location: Location = inject(Location);
  private router: Router = inject(Router);

  public goBack(): void {
    this.location.back();
  }

  public async navigateToRoute(path: string): Promise<void> {
    await this.router.navigate([`/home/${path}`]);
  }

  public toggleAddNewContactContainer(): void {
    this.showAddNewContactContainer = !this.showAddNewContactContainer;
  }

  public toggleEditContactContainer(): void {
    this.showEditContactContainer = !this.showEditContactContainer;
  }

  public closeEditDeleteContainer(): void {
    this.showEditDeleteContainer = false;
  }

  /**
   * Toggles the visibility of the edit/delete container for a contact.
   * 
   * @param {Object} event - The event object.
   * @param {Function} event.stopPropagation - A function that stops the event from bubbling up the DOM.
   */
  public toggleEditDeleteContainer(event: { stopPropagation: () => void; }): void {
    event.stopPropagation();
    this.showEditDeleteContainer = !this.showEditDeleteContainer;
  }

  /**
   * Sets the current contact based on the provided contact.
   * If the provided contact is the same as the current contact, it resets the current contact.
   * 
   * @param {Contact} contact - The contact to set as the current contact.
   */
  public getCurrentContact(contact: Contact): void {
    if (this.currentContact.email === contact.email) {
      this.resetCurrentContact();
    } else {
      this.resetCurrentContact();
      setTimeout(() => {
        this.currentContact = contact;
      }, 1);
    }
  }

  /**
   * Resets the current contact to default values.
   */
  public resetCurrentContact(): void {
    this.currentContact = {
      name: '',
      email: '',
      phoneNumber: '',
      avatarLetters: '',
      avatarColor: ''
    };
  }

  /**
   * Triggers animations for adding a new contact.
   * 
   * This method manages the visibility of add contact animation 
   * and controls when to close it based on set timeouts.
   */
  public addContactAnimation(): void {
    setTimeout(() => {
      this.showAddNewContactAnimation = !this.showAddNewContactAnimation;
    }, 300);
    setTimeout(() => {
      this.closeAddContactAnimation = !this.closeAddContactAnimation;
    }, 1500);
    setTimeout(() => {
      this.showAddNewContactAnimation = false;
      this.closeAddContactAnimation = false;
    }, 2300);
  }
}