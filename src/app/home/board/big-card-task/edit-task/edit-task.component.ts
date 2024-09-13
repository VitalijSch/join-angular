import { Component, inject } from '@angular/core';
import { TaskSubtasksComponent } from "../../../add-task/task-subtasks/task-subtasks.component";
import { TaskCategoryComponent } from "../../../add-task/task-category/task-category.component";
import { TaskPrioComponent } from "../../../add-task/task-prio/task-prio.component";
import { TaskDueDateComponent } from "../../../add-task/task-due-date/task-due-date.component";
import { TaskAssignedToComponent } from "../../../add-task/task-assigned-to/task-assigned-to.component";
import { TaskDescriptionComponent } from "../../../add-task/task-description/task-description.component";
import { TaskTitleComponent } from "../../../add-task/task-title/task-title.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HomeService } from '../../../../services/home/home.service';
import { FirebaseAuthenticationService } from '../../../../services/firebase-authentication/firebase-authentication.service';
import { FirebaseDatabaseService } from '../../../../services/firebase-database/firebase-database.service';
import { AddTaskService } from '../../../../services/add-task/add-task.service';
import { BoardService } from '../../../../services/board/board.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TaskSubtasksComponent,
    TaskCategoryComponent,
    TaskPrioComponent,
    TaskDueDateComponent,
    TaskAssignedToComponent,
    TaskDescriptionComponent,
    TaskTitleComponent
  ],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.scss'
})
export class EditTaskComponent {
  public homeService: HomeService = inject(HomeService);
  public firebaseAuthenticationService: FirebaseAuthenticationService = inject(FirebaseAuthenticationService);
  public firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);
  public addTaskService: AddTaskService = inject(AddTaskService);
  public boardService: BoardService = inject(BoardService);
  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);

  public taskForm!: FormGroup;

  public showCreateTaskMessage: boolean = false;

  public ngOnInit(): void {
    this.moveUserToFrontInContacts();
    if (this.router.url.includes('board')) {
      if (this.boardService.selectedTask) {
        this.addTaskService.task = this.boardService.selectedTask;
      }
    }
    this.setupTaskForm();
    this.addTaskService.task.status = this.addTaskService.status;
  }

  private moveUserToFrontInContacts(): void {
    this.firebaseDatabaseService.contacts().forEach(contact => {
      contact.selected = false;
    });
    this.addTaskService.task.assignedTo = this.firebaseDatabaseService.contacts();
    const currentUserEmail = this.firebaseAuthenticationService.auth.currentUser?.email;
    const userIndex = this.addTaskService.task.assignedTo.findIndex(contact => contact.email === currentUserEmail);
    if (userIndex !== -1) {
      const [userContact] = this.addTaskService.task.assignedTo.splice(userIndex, 1);
      this.addTaskService.task.assignedTo.unshift(userContact);
    }
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
    this.addTaskService.searchedContact = this.firebaseDatabaseService.contacts();
  }

  public clearSubtaskForm(): void {
    this.addTaskService.resetTask();
    this.addTaskService.resetPrio();
    this.addTaskService.isCategoryInvalid = false;
    this.firebaseDatabaseService.contacts().forEach(contact => {
      contact.selected = false;
    });
    this.setupTaskForm();
  }

  public async createTask(): Promise<void> {
    if (this.taskForm.valid && this.taskForm.get('selectCategory')?.value !== 'Select task category') {
      await this.firebaseDatabaseService.addTask(this.addTaskService.task);
      this.boardService.sortTasks(this.firebaseDatabaseService.tasks());
      this.homeService.disabledElement = true;
      this.showCreateTaskMessage = true;
      if (!this.checkCurrentUrl()) {
        this.boardService.toggleShowAddTask();
      }
      setTimeout(async () => {
        this.clearSubtaskForm();
        this.homeService.disabledElement = false;
        await this.router.navigate(['/home/board']);
      }, 1500);
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
}
