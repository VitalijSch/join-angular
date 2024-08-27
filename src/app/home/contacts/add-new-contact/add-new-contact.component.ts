import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HomeService } from '../../../services/home/home.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseAuthenticationService } from '../../../services/firebase-authentication/firebase-authentication.service';
import { FirebaseDatabaseService } from '../../../services/firebase-database/firebase-database.service';
import { ContactColorsService } from '../../../services/contact-colors/contact-colors.service';

@Component({
  selector: 'app-add-new-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-new-contact.component.html',
  styleUrl: './add-new-contact.component.scss'
})
export class AddNewContactComponent {
  public homeService: HomeService = inject(HomeService);
  public firebaseAuthenticationService: FirebaseAuthenticationService = inject(FirebaseAuthenticationService);
  private firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);
  private contactColorsServie: ContactColorsService = inject(ContactColorsService);
  private fb: FormBuilder = inject(FormBuilder);

  public userForm!: FormGroup;

  ngOnInit(): void {
    this.setupUserForm();
  }

  private setupUserForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-ZÄÖÜ][a-zA-ZäöüßÄÖÜ]+\s[A-ZÄÖÜ][a-zA-ZäöüßÄÖÜ]+$/)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      phoneNumber: ['', [Validators.pattern(/^\+?[0-9]{7,15}$/)]]
    });
  }

  public async createContact(): Promise<void> {
    const name = this.userForm.get('name')?.value;
    const email = this.userForm.get('email')?.value;
    const phoneNumber = this.userForm.get('phoneNumber')?.value;
    const emailExists = this.firebaseDatabaseService.contacts().some(contact => contact.email === email);
    this.checkIfEmailExistAtContacts(emailExists);
    if (this.userForm.valid && !emailExists) {
      await this.addContact(name, email, phoneNumber);
      this.homeService.toggleShowHiddenContainer();
      this.homeService.addContactAnimation();
      this.userForm.reset();
    }
  }

  private checkIfEmailExistAtContacts(emailExists: boolean): void {
    if (emailExists) {
      this.firebaseAuthenticationService.handleErrorMessage('This email address is already taken.');
    }
  }

  public async addContact(name: string, email: string, phoneNumber: number | string): Promise<void> {
    phoneNumber = phoneNumber === undefined ? '' : phoneNumber;
    const contact = {
      name,
      email,
      phoneNumber,
      avatarLetters: this.getContactInitials(name),
      avatarColor: this.contactColorsServie.getRandomColor()
    }
    await this.firebaseDatabaseService.addContact(contact);
    this.homeService.currentContact = contact;
  }

  private getContactInitials(name: string): string {
    const nameParts = name.split(' ');
    const initials = nameParts
      .map(part => part.charAt(0).toUpperCase())
      .join('');
    return initials;
  }
}
