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
    avatarLetters: '',
    avatarColor: ''
  };

  public showHiddenContainer: boolean = false;

  public goBack(): void {
    this.location.back();
  }

  public async navigateToRoute(path: string): Promise<void> {
    await this.router.navigate([`/home/${path}`]);
  }

  public toggleShowHiddenContainer(): void {
    this.showHiddenContainer = !this.showHiddenContainer;
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
      avatarLetters: '',
      avatarColor: ''
    };
  }
}
