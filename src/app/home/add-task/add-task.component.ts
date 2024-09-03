import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HomeService } from '../../services/home/home.service';
import { FirebaseAuthenticationService } from '../../services/firebase-authentication/firebase-authentication.service';
import { FirebaseDatabaseService } from '../../services/firebase-database/firebase-database.service';
import { TaskTitleComponent } from "./task-title/task-title.component";
import { TaskDescriptionComponent } from './task-description/task-description.component';
import { TaskAssignedToComponent } from './task-assigned-to/task-assigned-to.component';
import { AddTaskService } from '../../services/add-task/add-task.service';
import { TaskDueDateComponent } from './task-due-date/task-due-date.component';
import { TaskPrioComponent } from './task-prio/task-prio.component';
import { TaskCategoryComponent } from './task-category/task-category.component';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TaskTitleComponent,
    TaskDescriptionComponent,
    TaskAssignedToComponent,
    TaskDueDateComponent,
    TaskPrioComponent,
    TaskCategoryComponent
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  public homeService: HomeService = inject(HomeService);
  public firebaseAuthenticationService: FirebaseAuthenticationService = inject(FirebaseAuthenticationService);
  public firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);
  public addTaskService: AddTaskService = inject(AddTaskService);
  private fb: FormBuilder = inject(FormBuilder);

  public taskForm!: FormGroup;

  public ngOnInit(): void {
    this.moveUserToFrontInContacts();
    this.setupTaskForm();
  }

  private moveUserToFrontInContacts(): void {
    this.firebaseDatabaseService.contacts().forEach(contact => {
      contact.selected = false;
    });
    this.addTaskService.contacts = this.firebaseDatabaseService.contacts();
    const currentUserEmail = this.firebaseAuthenticationService.auth.currentUser?.email;
    const userIndex = this.addTaskService.contacts.findIndex(contact => contact.email === currentUserEmail);
    if (userIndex !== -1) {
      const [userContact] = this.addTaskService.contacts.splice(userIndex, 1);
      this.addTaskService.contacts.unshift(userContact);
    }
  }

  private setupTaskForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s\-_,\.;:()]+$/)]],
      searchContact: [''],
      dueDate: ['', [Validators.required]],
      selectCategory: ['Select task category', [Validators.required]]
    });
  }

  public closeContactsAndCategory(): void {
    this.addTaskService.showContacts = false;
    this.addTaskService.showCategory = false;
    this.taskForm.get('searchContact')?.reset();
    this.addTaskService.contacts = this.firebaseDatabaseService.contacts();
  }

  public async createTask(): Promise<void> {
  }
}
