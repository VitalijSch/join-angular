import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { CollectionReference, DocumentData, Firestore } from '@angular/fire/firestore';
import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { Unsubscribe } from 'firebase/auth';
import { Contact } from '../../interfaces/contact';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDatabaseService {
  private firestore: Firestore = inject(Firestore);

  private unsubscribe!: Unsubscribe;

  public contacts: WritableSignal<Contact[]> = signal<Contact[]>([]);

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
    });
  }

  public async addContact(contact: Contact): Promise<void> {
    try {
      const userDocRef = doc(this.contactCollection());
      contact.id = userDocRef.id;
      await setDoc(userDocRef, contact);
      this.getContact();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  }

  public async deleteContact(id: string): Promise<void> {
    try {
      const customerDocRef = doc(this.contactCollection(), id);
      await deleteDoc(customerDocRef);
      this.getContact();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  public ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}