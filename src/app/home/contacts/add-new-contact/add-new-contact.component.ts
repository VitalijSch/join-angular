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
  public contactForm!: FormGroup;

  public homeService: HomeService = inject(HomeService);
  public firebaseAuthenticationService: FirebaseAuthenticationService = inject(FirebaseAuthenticationService);

  private firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);
  private contactColorsServie: ContactColorsService = inject(ContactColorsService);
  private fb: FormBuilder = inject(FormBuilder);

  /**
   * Initializes the component and sets up the contact form.
   *
   * This method is called once the component is initialized. It
   * initializes the contact form with default values and validators.
   */
  ngOnInit(): void {
    this.setupContactForm();
  }

  /**
  * Sets up the contact form with validators for each field.
  *
  * The form includes three fields: name, email, and phone number.
  * The name must start with a capital letter and consist of two
  * capitalized words, the email must be valid, and the phone number
  * must match a specific pattern.
  *
  * @private
  */
  private setupContactForm(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-ZÄÖÜ][a-zA-ZäöüßÄÖÜ]+\s[A-ZÄÖÜ][a-zA-ZäöüßÄÖÜ]+$/)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      phoneNumber: ['', [Validators.pattern(/^\+?[0-9]{7,15}$/)]]
    });
  }

  /**
  * Creates a new contact based on the form values.
  *
  * This method checks if the form is valid and if the email already
  * exists in the contacts list. If the email is unique and the form
  * is valid, it calls the `addContact` method to save the new contact.
  *
  * @returns {Promise<void>} A promise that resolves when the contact is created.
  */
  public async createContact(): Promise<void> {
    const name = this.contactForm.get('name')?.value;
    const email = this.contactForm.get('email')?.value;
    const phoneNumber = this.contactForm.get('phoneNumber')?.value;
    const emailExists = this.firebaseDatabaseService.contacts.some(contact => contact.email === email);
    this.checkIfEmailExistAtContacts(emailExists);
    if (this.contactForm.valid && !emailExists) {
      await this.addContact(name, email, phoneNumber);
      this.homeService.toggleAddNewContactContainer();
      this.homeService.addContactAnimation();
      this.contactForm.reset();
    }
  }

  /**
  * Adds a new contact to the database.
  *
  * This method constructs a contact object using the provided
  * name, email, and phone number, along with generated initials
  * and a random avatar color. It then calls the Firebase database
  * service to add the contact.
  *
  * @param {string} name - The name of the contact.
  * @param {string} email - The email of the contact.
  * @param {number | string} phoneNumber - The phone number of the contact.
  * @returns {Promise<void>} A promise that resolves when the contact is added.
  */
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

  /**
  * Checks if the provided email already exists in the contacts.
  *
  * If the email exists, it triggers an error message through
  * the Firebase authentication service.
  *
  * @param {boolean} emailExists - A boolean indicating if the email exists.
  * @private
  */
  private checkIfEmailExistAtContacts(emailExists: boolean): void {
    if (emailExists) {
      this.firebaseAuthenticationService.handleErrorMessage('This email address is already taken.');
    }
  }

  /**
  * Retrieves the initials from the contact's name.
  *
  * This method splits the name into parts and returns the first
  * letter of each part in uppercase, concatenated as initials.
  *
  * @param {string} name - The full name of the contact.
  * @returns {string} The initials of the contact's name.
  * @private
  */
  private getContactInitials(name: string): string {
    const nameParts = name.split(' ');
    const initials = nameParts
      .map(part => part.charAt(0).toUpperCase())
      .join('');
    return initials;
  }
}
