import { inject, Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore } from '@angular/fire/firestore';
import { User } from '../../interfaces/user';
import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { Unsubscribe } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDatabaseService {
  private firestore: Firestore = inject(Firestore);

  private unsubUser!: Unsubscribe;

  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor() {
    this.getUser();
  }

  private userCollection(): CollectionReference<DocumentData> {
    return collection(this.firestore, 'user');
  }

  public getUser(): void {
    this.unsubUser = onSnapshot(this.userCollection(), (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.userSubject.next(doc.data() as User);
      });
    })
  }

  public async addUser(user: User): Promise<void> {
    const userDocRef = doc(this.userCollection());
    user.id = userDocRef.id;
    await setDoc(userDocRef, user);
  }

  public async deleteUser(id: string): Promise<void> {
    const customerDocRef = doc(this.userCollection(), id);
    await deleteDoc(customerDocRef);
  }

  onNgDestroy(): void {
    if (this.unsubUser) {
      this.unsubUser;
    }
  }
}