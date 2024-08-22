import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { CollectionReference, DocumentData, Firestore } from '@angular/fire/firestore';
import { User } from '../../interfaces/user';
import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { Unsubscribe } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDatabaseService {
  private firestore: Firestore = inject(Firestore);

  private unsubscribe!: Unsubscribe;

  public user: WritableSignal<User | null> = signal<User | null>(null);

  private userCollection(): CollectionReference<DocumentData> {
    return collection(this.firestore, 'user');
  }

  public getUser(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.unsubscribe = onSnapshot(this.userCollection(), (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.user.set(doc.data() as User);
        });
        resolve();
      }, reject);
    });
  }

  public async addUser(user: User): Promise<void> {
    try {
      const userDocRef = doc(this.userCollection());
      user.id = userDocRef.id;
      await setDoc(userDocRef, user);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  }

  public async deleteUser(id: string): Promise<void> {
    try {
      const customerDocRef = doc(this.userCollection(), id);
      await deleteDoc(customerDocRef);
      const user: User = {
        email: '',
        password: ''
      };
      this.user.set(user);
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