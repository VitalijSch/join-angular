import { Location } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Contact } from '../../interfaces/contact';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private location: Location = inject(Location);
  private router: Router = inject(Router);

  public currentContact: Contact = {
    name: '',
    email: '',
    phoneNumber: '',
    avatarLetters: '',
    avatarColor: ''
  };

  public showAddNewContactContainer: boolean = false;
  public showAddNewContactAnimation: boolean = false;

  public showEditContactContainer: boolean = false;
  public showEditContactAnimation: boolean = false;
  
  public closeAddContactAnimation: boolean = false;

  public disabledElement: boolean = false;

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

  public resetCurrentContact(): void {
    this.currentContact = {
      name: '',
      email: '',
      phoneNumber: '',
      avatarLetters: '',
      avatarColor: ''
    };
  }

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
