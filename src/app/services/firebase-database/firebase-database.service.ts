import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { CollectionReference, DocumentData, Firestore } from '@angular/fire/firestore';
import { collection, deleteDoc, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { Unsubscribe } from 'firebase/auth';
import { Contact } from '../../interfaces/contact';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDatabaseService {
  private firestore: Firestore = inject(Firestore);

  private unsubscribe!: Unsubscribe;

  public contacts: WritableSignal<Contact[]> = signal<Contact[]>([]);
  public letters: string[] = [];

  constructor() {
    this.getContact();
  }

  private contactCollection(): CollectionReference<DocumentData> {
    return collection(this.firestore, 'contacts');
  }

  public getContact(): void {
    this.unsubscribe = onSnapshot(this.contactCollection(), (querySnapshot) => {
      let currentContacts: Contact[] = [];
      querySnapshot.forEach((doc) => {
        currentContacts.push(doc.data() as Contact);
      });
      this.contacts.set(currentContacts);
      this.getLettersForContacts();
      this.sortContactsByName();
    });
  }

  public async addContact(contact: Contact): Promise<void> {
    try {
      const userDocRef = doc(this.contactCollection());
      contact.id = userDocRef.id;
      await setDoc(userDocRef, contact);
      this.contacts.set(this.contacts());
      this.getLettersForContacts();
      this.sortContactsByName();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  }

  public async updateContact(contact: Contact): Promise<void> {
    try {
      const contactDocRef = doc(this.contactCollection(), contact.id);
      const JSONContact = JSON.parse(JSON.stringify(contact));
      await updateDoc(contactDocRef, JSONContact);
      this.contacts.set(this.contacts());
      this.getLettersForContacts();
      this.sortContactsByName();
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  }

  public async deleteContact(id: string): Promise<void> {
    try {
      const customerDocRef = doc(this.contactCollection(), id);
      await deleteDoc(customerDocRef);
      this.contacts.set(this.contacts());
      this.getLettersForContacts();
      this.sortContactsByName();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  private getLettersForContacts(): void {
    this.letters = [];
    this.contacts().forEach(contact => {
      const firstLetter = contact.name.charAt(0);
      if (!this.letters.includes(firstLetter)) {
        this.letters.push(firstLetter);
      }
      this.letters.sort();
    });
  }

  private sortContactsByName(): void {
    this.contacts().sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }

  public ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}