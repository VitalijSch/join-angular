import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { CollectionReference, DocumentData, Firestore } from '@angular/fire/firestore';
import { collection, deleteDoc, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { Unsubscribe } from 'firebase/auth';
import { Contact } from '../../interfaces/contact';
import { Task } from '../../interfaces/task';
import { TaskList } from '../../interfaces/task-list';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDatabaseService {
  private firestore: Firestore = inject(Firestore);

  private unsubscribeContact!: Unsubscribe;
  private unsubscribeTask!: Unsubscribe;
  private unsubscribeTaskList!: Unsubscribe;

  public contacts: WritableSignal<Contact[]> = signal<Contact[]>([]);
  public tasks: WritableSignal<Task[]> = signal<Task[]>([]);
  public taskList: WritableSignal<TaskList> = signal<TaskList>({
    id: '',
    toDo: [],
    inProgress: [],
    awaitFeedback: [],
    done: []
  });

  public letters: string[] = [];

  constructor() {
    this.getContact();
    this.getTask();
    this.getTaskList();
  }

  private contactCollection(): CollectionReference<DocumentData> {
    return collection(this.firestore, 'contacts');
  }

  private taskCollection(): CollectionReference<DocumentData> {
    return collection(this.firestore, 'tasks');
  }

  private taskListCollection(): CollectionReference<DocumentData> {
    return collection(this.firestore, 'taskList');
  }

  public getContact(): void {
    this.unsubscribeContact = onSnapshot(this.contactCollection(), (querySnapshot) => {
      let currentContacts: Contact[] = [];
      querySnapshot.forEach((doc) => {
        currentContacts.push(doc.data() as Contact);
      });
      this.contacts.set(currentContacts);
      this.getLettersForContacts();
      this.sortContactsByName();
    });
  }

  public getTask(): void {
    this.unsubscribeTask = onSnapshot(this.taskCollection(), (querySnapshot) => {
      let currentTasks: Task[] = [];
      querySnapshot.forEach((doc) => {
        currentTasks.push(doc.data() as Task);
      });
      this.tasks.set(currentTasks);
    });
  }

  public getTaskList(): void {
    this.unsubscribeTaskList = onSnapshot(this.taskListCollection(), (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.taskList.set(doc.data() as TaskList);
      });
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

  public async addTask(task: Task): Promise<void> {
    try {
      const userDocRef = doc(this.taskCollection());
      task.id = userDocRef.id;
      await setDoc(userDocRef, task);
      this.tasks.set(this.tasks());
    } catch (error) {
      console.error('Error adding user:', error);
    }
  }

  public async addTaskList(task: TaskList): Promise<void> {
    try {
      const userDocRef = doc(this.taskListCollection());
      task.id = userDocRef.id;
      await setDoc(userDocRef, task);
      this.taskList.set(this.taskList());
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

  public async updateTask(task: Task): Promise<void> {
    try {
      const taskDocRef = doc(this.taskCollection(), task.id);
      const JSONTask = JSON.parse(JSON.stringify(task));
      await updateDoc(taskDocRef, JSONTask);
      this.tasks.set(this.tasks());
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  }

  public async updateTaskList(task: TaskList): Promise<void> {
    try {
      const taskDocRef = doc(this.taskListCollection(), task.id);
      const JSONTask = JSON.parse(JSON.stringify(task));
      await updateDoc(taskDocRef, JSONTask);
      this.taskList.set(this.taskList());
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

  public async deleteTask(id: string): Promise<void> {
    try {
      const customerDocRef = doc(this.taskCollection(), id);
      await deleteDoc(customerDocRef);
      this.tasks.set(this.tasks());
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

  public async sortTasks(tasks: Task[]): Promise<void> {
    this.taskList().toDo = tasks.filter(task => task.status === 'To do');
    this.taskList().inProgress = tasks.filter(task => task.status === 'In progress');
    this.taskList().awaitFeedback = tasks.filter(task => task.status === 'Await feedback');
    this.taskList().done = tasks.filter(task => task.status !== 'To do' && task.status !== 'In progress' && task.status !== 'Await feedback');
    if(this.taskList().id === '') {
      await this.addTaskList(this.taskList());
    } else {
      await this.updateTaskList(this.taskList());
    }
  }

  public ngOnDestroy(): void {
    if (this.unsubscribeContact) {
      this.unsubscribeContact();
    }
    if (this.unsubscribeTask) {
      this.unsubscribeTask();
    }
    if (this.unsubscribeTaskList) {
      this.unsubscribeTaskList();
    }
  }
}