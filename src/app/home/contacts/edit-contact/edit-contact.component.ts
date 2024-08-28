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
  public homeService: HomeService = inject(HomeService);
  public firebaseAuthenticationService: FirebaseAuthenticationService = inject(FirebaseAuthenticationService);
  private firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);
  private fb: FormBuilder = inject(FormBuilder);

  public contactForm!: FormGroup;

  public ngOnInit(): void {
    this.setupContactForm();
  }

  private setupContactForm(): void {
    this.contactForm = this.fb.group({
      name: [this.homeService.currentContact.name, [Validators.required, Validators.pattern(/^[A-ZÄÖÜ][a-zA-ZäöüßÄÖÜ]+\s[A-ZÄÖÜ][a-zA-ZäöüßÄÖÜ]+$/)]],
      email: [this.homeService.currentContact.email, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      phoneNumber: [this.homeService.currentContact.phoneNumber, [Validators.pattern(/^\+?[0-9]{7,15}$/)]]
    });
  }

  public async deleteContact(): Promise<void> {
    const indexOfContact = this.firebaseDatabaseService.contacts().findIndex(contact => contact.email === this.homeService.currentContact.email);
    const idOfContact = this.firebaseDatabaseService.contacts()[indexOfContact].id;
    if (idOfContact) {
      this.homeService.resetCurrentContact();
      this.homeService.toggleEditContactContainer();
      await this.firebaseDatabaseService.deleteContact(idOfContact);
    }
  }

  public async updateContact(): Promise<void> {
    const name = this.contactForm.get('name')?.value;
    const email = this.contactForm.get('email')?.value;
    const phoneNumber = this.contactForm.get('phoneNumber')?.value;
    if (this.hasContactChanged(name, email, phoneNumber) && this.contactForm.valid) {
      const indexOfContact = this.firebaseDatabaseService.contacts().findIndex(contact => contact.email === this.homeService.currentContact.email);
      await this.firebaseDatabaseService.updateContact(this.editContact(name, email, phoneNumber, indexOfContact));
      this.homeService.currentContact = this.firebaseDatabaseService.contacts()[indexOfContact];
    }
    this.homeService.toggleEditContactContainer();
  }

  private hasContactChanged(name: string, email: string, phoneNumber: string): boolean {
    return this.homeService.currentContact.name !== name ||
      this.homeService.currentContact.email !== email ||
      this.homeService.currentContact.phoneNumber !== phoneNumber;
  }

  private editContact(name: string, email: string, phoneNumber: string | number, indexOfContact: number): Contact {
    this.firebaseDatabaseService.contacts()[indexOfContact].name = name;
    this.firebaseDatabaseService.contacts()[indexOfContact].email = email;
    this.firebaseDatabaseService.contacts()[indexOfContact].phoneNumber = phoneNumber;
    this.firebaseDatabaseService.contacts()[indexOfContact].avatarLetters = this.getContactInitials(name);
    const currentContact = this.firebaseDatabaseService.contacts()[indexOfContact];
    return currentContact;
  }

  private getContactInitials(name: string): string {
    const nameParts = name.split(' ');
    const initials = nameParts
      .map(part => part.charAt(0).toUpperCase())
      .join('');
    return initials;
  }
}