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
  public contacts!: Contact[];
  public taskList!: TaskList;
  public tasks: Task[] = [];
  public letters: string[] = [];

  private newTaskList: TaskList = {
    id: '',
    toDo: [],
    inProgress: [],
    awaitFeedback: [],
    done: []
  };

  private firestore: Firestore = inject(Firestore);

  public taskListSubject: BehaviorSubject<TaskList> = new BehaviorSubject<TaskList>({
    id: '',
    toDo: [],
    inProgress: [],
    awaitFeedback: [],
    done: []
  });
  private contactsSubject: BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>([]);

  public contacts$: Observable<Contact[]> = this.contactsSubject.asObservable();
  public taskList$: Observable<TaskList> = this.taskListSubject.asObservable();

  private unsubscribeContact!: Unsubscribe;
  private unsubscribeTaskList!: Unsubscribe;

  constructor() {
    this.getContact();
    this.getTaskList();
  }

  /**
   * Cleans up subscriptions to Firestore snapshots when the component is destroyed.
   */
  public ngOnDestroy(): void {
    if (this.unsubscribeContact) {
      this.unsubscribeContact();
    }
    if (this.unsubscribeTaskList) {
      this.unsubscribeTaskList();
    }
  }

  /**
   * Retrieves the contact list from Firestore and updates the local contacts array.
   * It also emits the contacts to the contacts subject and retrieves letters for contacts.
   * 
   * @returns {Promise<void>} - A promise that resolves when the contact retrieval is complete.
   */
  public getContact(): Promise<void> {
    return new Promise((resolve) => {
      this.unsubscribeContact = onSnapshot(this.contactCollection(), (querySnapshot) => {
        this.contacts = [];
        querySnapshot.forEach((doc) => {
          this.contacts.push(doc.data() as Contact);
        });
        this.contactsSubject.next(this.contacts);
        this.getLettersForContacts();
        this.sortContactsByName();
        resolve();
      });
    });
  }

  /**
   * Retrieves the task list from Firestore and updates the local task list.
   * If the task list is empty, it adds a new task list.
   * 
   * @returns {Promise<void>} - A promise that resolves when the task list retrieval is complete.
   */
  public getTaskList(): Promise<void> {
    return new Promise((resolve) => {
      this.unsubscribeTaskList = onSnapshot(this.taskListCollection(), (querySnapshot) => {
        if (querySnapshot.empty) {
          this.addTaskList(this.newTaskList);
          resolve();
        } else {
          querySnapshot.forEach((doc) => {
            this.taskList = doc.data() as TaskList;
          });
          this.taskListSubject.next(this.taskList);
          resolve();
        }
      });
    });
  }

  /**
   * Adds a new contact to Firestore and updates the local contacts list.
   * 
   * @param {Contact} contact - The contact object to add.
   * @returns {Promise<void>} - A promise that resolves when the contact has been added.
   */
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

  /**
   * Adds a new task list to Firestore.
   * 
   * @param {TaskList} taskList - The task list object to add.
   * @returns {Promise<void>} - A promise that resolves when the task list has been added.
   */
  public async addTaskList(taskList: TaskList): Promise<void> {
    try {
      const userDocRef = doc(this.taskListCollection());
      taskList.id = userDocRef.id;
      await setDoc(userDocRef, taskList);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  }

  /**
   * Updates an existing contact in Firestore.
   * 
   * @param {Contact} contact - The contact object with updated data.
   * @returns {Promise<void>} - A promise that resolves when the contact has been updated.
   */
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

  /**
   * Updates an existing task list in Firestore.
   * 
   * @param {TaskList} taskList - The task list object with updated data.
   * @returns {Promise<void>} - A promise that resolves when the task list has been updated.
   */
  public async updateTaskList(taskList: TaskList): Promise<void> {
    try {
      const taskDocRef = doc(this.taskListCollection(), taskList.id);
      const JSONTask = JSON.parse(JSON.stringify(taskList));
      await updateDoc(taskDocRef, JSONTask);
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  }

  /**
   * Deletes a contact from Firestore and updates the local contacts list.
   * 
   * @param {string} id - The ID of the contact to delete.
   * @returns {Promise<void>} - A promise that resolves when the contact has been deleted.
   */
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

  /**
   * Sorts tasks by their status and updates the task list.
   * 
   * @param {Task} task - The task to sort.
   * @returns {Promise<void>} - A promise that resolves when the task sorting is complete.
   */
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

  /**
   * Gets a reference to the Firestore collection of contacts.
   * 
   * @returns {CollectionReference<DocumentData>} - The contacts collection reference.
   */
  private contactCollection(): CollectionReference<DocumentData> {
    return collection(this.firestore, 'contacts');
  }

  /**
   * Gets a reference to the Firestore collection of task lists.
   * 
   * @returns {CollectionReference<DocumentData>} - The task list collection reference.
   */
  private taskListCollection(): CollectionReference<DocumentData> {
    return collection(this.firestore, 'taskList');
  }

  /**
   * Generates a list of unique letters from the contacts' names.
   * Updates the letters array accordingly.
   */
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

  /**
   * Sorts the contacts by their names in alphabetical order.
   */
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
}