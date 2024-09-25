import { inject, Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore } from '@angular/fire/firestore';
import { collection, deleteDoc, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { Unsubscribe } from 'firebase/auth';
import { Contact } from '../../interfaces/contact';
import { Task } from '../../interfaces/task';
import { TaskList } from '../../interfaces/task-list';
import { BehaviorSubject, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDatabaseService {
  private firestore: Firestore = inject(Firestore);

  private unsubscribeContact!: Unsubscribe;
  private unsubscribeTaskList!: Unsubscribe;

  private contactsSubject: BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>([]);
  public taskListSubject: BehaviorSubject<TaskList> = new BehaviorSubject<TaskList>({
    id: '',
    toDo: [],
    inProgress: [],
    awaitFeedback: [],
    done: []
  });

  public contacts$: Observable<Contact[]> = this.contactsSubject.asObservable();
  public taskList$: Observable<TaskList> = this.taskListSubject.asObservable();

  public contacts!: Contact[];
  public taskList!: TaskList;
  public tasks: Task[] = [];

  public letters: string[] = [];

  constructor() {
    this.getContact();
    this.getTaskList();
  }

  private contactCollection(): CollectionReference<DocumentData> {
    return collection(this.firestore, 'contacts');
  }

  private taskListCollection(): CollectionReference<DocumentData> {
    return collection(this.firestore, 'taskList');
  }

  public getContact(): void {
    this.unsubscribeContact = onSnapshot(this.contactCollection(), (querySnapshot) => {
      this.contacts = [];
      querySnapshot.forEach((doc) => {
        this.contacts.push(doc.data() as Contact);
      });
      this.contactsSubject.next(this.contacts);
      this.getLettersForContacts();
      this.sortContactsByName();
    });
  }

  public getTaskList(): void {
    this.unsubscribeTaskList = onSnapshot(this.taskListCollection(), (querySnapshot) => {
      if (querySnapshot.empty) {
        const newTaskList: TaskList = {
          id: '',
          toDo: [],
          inProgress: [],
          awaitFeedback: [],
          done: []
        };
        this.addTaskList(newTaskList);
      } else {
        querySnapshot.forEach((doc) => {
          this.taskList = doc.data() as TaskList;
        });
        this.taskListSubject.next(this.taskList);
      }
    });
  }

  public async addContact(contact: Contact): Promise<void> {
    try {
      const userDocRef = doc(this.contactCollection());
      contact.id = userDocRef.id;
      await setDoc(userDocRef, contact);
      this.getLettersForContacts();
      this.sortContactsByName();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  }

  public async addTaskList(taskList: TaskList): Promise<void> {
    try {
      const userDocRef = doc(this.taskListCollection());
      taskList.id = userDocRef.id;
      await setDoc(userDocRef, taskList);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  }

  public async updateContact(contact: Contact): Promise<void> {
    try {
      const contactDocRef = doc(this.contactCollection(), contact.id);
      const JSONContact = JSON.parse(JSON.stringify(contact));
      await updateDoc(contactDocRef, JSONContact);
      this.getLettersForContacts();
      this.sortContactsByName();
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  }

  public async updateTaskList(taskList: TaskList): Promise<void> {
    try {
      const taskDocRef = doc(this.taskListCollection(), taskList.id);
      const JSONTask = JSON.parse(JSON.stringify(taskList));
      await updateDoc(taskDocRef, JSONTask);
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  }

  public async deleteContact(id: string): Promise<void> {
    try {
      const customerDocRef = doc(this.contactCollection(), id);
      await deleteDoc(customerDocRef);
      const currentContacts = this.contactsSubject.getValue().filter(contact => contact.id !== id);
      this.contactsSubject.next(currentContacts);
      this.getLettersForContacts();
      this.sortContactsByName();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  private getLettersForContacts(): void {
    this.letters = [];
    this.contacts$.forEach(contacts => {
      contacts.forEach(contact => {
        const firstLetter = contact.name.charAt(0);
        if (!this.letters.includes(firstLetter)) {
          this.letters.push(firstLetter);
        }
        this.letters.sort();
      });
    });
  }

  private sortContactsByName(): void {
    this.contacts$.forEach(contacts => {
      contacts.sort((a, b) => {
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
    });
  }

  public async sortTasksByStatus(task: Task): Promise<void> {
    this.taskList$.pipe(take(1)).subscribe(taskList => {
      if (task.status === 'To do') {
        taskList.toDo.push(task);
      }
      if (task.status === 'In progress') {
        taskList.inProgress.push(task);
      }
      if (task.status === 'Await feedback') {
        taskList.awaitFeedback.push(task);
      }
      if (task.status === 'Done') {
        taskList.done.push(task);
      }
      this.updateTaskList(taskList);
    });

  }

  public ngOnDestroy(): void {
    if (this.unsubscribeContact) {
      this.unsubscribeContact();
    }
    if (this.unsubscribeTaskList) {
      this.unsubscribeTaskList();
    }
  }
}