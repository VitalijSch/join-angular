import { inject, Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore } from '@angular/fire/firestore';
import { User } from '../../interfaces/user';
import { addDoc, collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { Unsubscribe } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDatabaseService {
  private firestore: Firestore = inject(Firestore);

  private unsubUser!: Unsubscribe;

  private userCollection(): CollectionReference<DocumentData> {
    return collection(this.firestore, 'user');
  }

  public getUsers(): void {
    this.unsubUser = onSnapshot(this.userCollection(), (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.data() as User);
      });
    })
  }

  public async addUser(user: User): Promise<void> {
    await addDoc(this.userCollection(), user);
  }

  public async deleteUser(id: string): Promise<void> {
    const customerDocRef = doc(this.userCollection(), id);
    await deleteDoc(customerDocRef);
  }

  onNgDestroy() {
    if (this.unsubUser) {
      this.unsubUser;
    }
  }
}