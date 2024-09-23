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
  private unsubscribeTask!: Unsubscribe;
  private unsubscribeTaskList!: Unsubscribe;

  private contactsSubject: BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>([]);
  private tasksSubject: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  private taskListSubject: BehaviorSubject<TaskList> = new BehaviorSubject<TaskList>({
    id: '',
    toDo: [],
    inProgress: [],
    awaitFeedback: [],
    done: []
  });

  public contacts$: Observable<Contact[]> = this.contactsSubject.asObservable();
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();
  public taskList$: Observable<TaskList> = this.taskListSubject.asObservable();

  public contacts!: Contact[];
  public tasks!: Task[];
  public taskList!: TaskList;

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
      this.contactsSubject.next(currentContacts);
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
      this.tasksSubject.next(currentTasks);
    });
  }

  public getTaskList(): void {
    this.unsubscribeTaskList = onSnapshot(this.taskListCollection(), (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.taskListSubject.next(doc.data() as TaskList);
      });
    });
  }

  public async addContact(contact: Contact): Promise<void> {
    try {
      const userDocRef = doc(this.contactCollection());
      contact.id = userDocRef.id;
      await setDoc(userDocRef, contact);
      const currentContacts = this.contactsSubject.getValue();
      currentContacts.push(contact);
      this.contactsSubject.next(currentContacts);
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
      const currentTasks = this.tasksSubject.getValue();
      currentTasks.push(task);
      this.tasksSubject.next(currentTasks);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  }

  public async addTaskList(taskList: TaskList): Promise<void> {
    try {
      const userDocRef = doc(this.taskListCollection());
      taskList.id = userDocRef.id;
      await setDoc(userDocRef, taskList);
      this.taskListSubject.next(taskList);
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

  public async updateTask(task: Task): Promise<void> {
    try {
      const taskDocRef = doc(this.taskCollection(), task.id);
      const JSONTask = JSON.parse(JSON.stringify(task));
      await updateDoc(taskDocRef, JSONTask);
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

  public async deleteTask(id: string): Promise<void> {
    try {
      const customerDocRef = doc(this.taskCollection(), id);
      await deleteDoc(customerDocRef);
      const currentTasks = this.tasksSubject.getValue().filter(task => task.id !== id);
      this.tasksSubject.next(currentTasks);
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

  public async addTasksByStatus(tasks: Task[]): Promise<void> {
    this.taskList$.pipe(take(1)).subscribe(taskList => {
      tasks.forEach(task => {
        if (task.status.includes('To do')) taskList.toDo.push(task);
        if (task.status.includes('In progress')) taskList.inProgress.push(task);
        if (task.status.includes('Await feedback')) taskList.awaitFeedback.push(task);
        if (task.status.includes('Done')) taskList.done.push(task);
      });
      this.addTaskList(taskList);
    });
  }

  public async sortTasksByStatus(tasks: Task[]): Promise<void> {
    this.taskList$.pipe(take(1)).subscribe(taskList => {
      tasks.forEach(task => {
        taskList.toDo = taskList.toDo.filter(t => t.id !== task.id);
        taskList.inProgress = taskList.inProgress.filter(t => t.id !== task.id);
        taskList.awaitFeedback = taskList.awaitFeedback.filter(t => t.id !== task.id);
        taskList.done = taskList.done.filter(t => t.id !== task.id);
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
      });
      this.updateTaskList(taskList);
    });

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