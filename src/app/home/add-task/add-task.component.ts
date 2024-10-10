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
import { TaskSubtasksComponent } from './task-subtasks/task-subtasks.component';
import { Router } from '@angular/router';
import { BoardService } from '../../services/board/board.service';

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
    TaskCategoryComponent,
    TaskSubtasksComponent
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  public showCreateTaskMessage: boolean = false;

  public taskForm!: FormGroup;

  public homeService: HomeService = inject(HomeService);
  public firebaseAuthenticationService: FirebaseAuthenticationService = inject(FirebaseAuthenticationService);
  public firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);
  public addTaskService: AddTaskService = inject(AddTaskService);
  public boardService: BoardService = inject(BoardService);

  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);

  public ngOnInit(): void {
    this.moveUserToFrontInContacts();
    this.addTaskService.resetPrio();
    this.addTaskService.resetTask();
    this.setupTaskForm();
    if (this.addTaskService.status === '') {
      this.addTaskService.status = 'To do';
    }
    console.log(this.addTaskService.status)
    this.addTaskService.task.status = this.addTaskService.status;
  }

  private setupTaskForm(): void {
    this.taskForm = this.fb.group({
      title: [this.addTaskService.task.title, [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s\-_,\.;:()]+$/)]],
      searchContact: [],
      dueDate: [this.addTaskService.task.dueDate, [Validators.required]],
      selectCategory: [this.addTaskService.task.category, [Validators.required]],
      subtasks: ['']
    });
  }

  public closeContactsAndCategory(): void {
    this.addTaskService.showContacts = false;
    this.addTaskService.showCategory = false;
    this.taskForm.get('searchContact')?.reset();
    this.addTaskService.searchedContact = this.firebaseDatabaseService.contacts;
  }

  public clearSubtaskForm(): void {
    this.addTaskService.resetTask();
    this.addTaskService.resetPrio();
    this.addTaskService.isCategoryInvalid = false;
    this.firebaseDatabaseService.contacts.forEach(contact => {
      contact.selected = false;
    });
    this.setupTaskForm();
  }

  public async createTask(): Promise<void> {
    if (this.taskForm.valid && this.taskForm.get('selectCategory')?.value !== 'Select task category') {
      await this.firebaseDatabaseService.sortTasksByStatus(this.addTaskService.task);
      this.handleSetTimeoutAndNavigate();
    }
    this.showErrorMessage();
  }

  public showErrorMessage(): void {
    if (this.taskForm.get('title')?.invalid) {
      this.addTaskService.isTitleInvalid = true;
    }
    if (this.taskForm.get('dueDate')?.invalid) {
      this.addTaskService.isDueDateInvalid = true;
    }
    if (this.taskForm.get('selectCategory')?.value === 'Select task category') {
      this.addTaskService.isCategoryInvalid = true;
    }
  }

  public checkCurrentUrl(): boolean {
    if (this.router.url.includes('/home/addTask')) {
      return true;
    } else {
      return false;
    }
  }

  private handleSetTimeoutAndNavigate(): void {
    this.homeService.disabledElement = true;
    this.showCreateTaskMessage = true;
    setTimeout(async () => {
      if (!this.checkCurrentUrl()) {
        this.boardService.toggleShowAddTask();
      }
      this.clearSubtaskForm();
      this.homeService.disabledElement = false;
      await this.router.navigate(['/home/board']);
    }, 1500);
  }

  private moveUserToFrontInContacts(): void {
    if (this.firebaseDatabaseService.contacts !== undefined) {
      this.firebaseDatabaseService.contacts.forEach(contact => {
        contact.selected = false;
      });
      const currentUserEmail = this.firebaseAuthenticationService.auth.currentUser?.email;
      const userIndex = this.addTaskService.task.assignedTo.findIndex(contact => contact.email === currentUserEmail);
      if (userIndex !== -1) {
        const [userContact] = this.addTaskService.task.assignedTo.splice(userIndex, 1);
        this.addTaskService.task.assignedTo.unshift(userContact);
      }
    }
  }
}
