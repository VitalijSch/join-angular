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

  /**
   * Lifecycle hook that is called after the component's view has been fully initialized.
   * This method initializes the form, moves the user to the front in contacts,
   * and sets the task status to 'To do' if not already set.
   *
   * @public
   * @returns {void}
   */
  public ngOnInit(): void {
    this.moveUserToFrontInContacts();
    this.addTaskService.resetPrio();
    this.addTaskService.resetTask();
    this.setupTaskForm();
    if (this.addTaskService.status === '') {
      this.addTaskService.status = 'To do';
    }
    this.addTaskService.task.status = this.addTaskService.status;
  }

  /**
  * Sets up the task form with validation rules for title, due date, and category fields.
  *
  * @private
  * @returns {void}
  */
  private setupTaskForm(): void {
    this.taskForm = this.fb.group({
      title: [this.addTaskService.task.title, [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s\-_,\.;:()]+$/)]],
      searchContact: [],
      dueDate: [this.addTaskService.task.dueDate, [Validators.required]],
      selectCategory: [this.addTaskService.task.category, [Validators.required]],
      subtasks: ['']
    });
  }

  /**
  * Closes the contacts and category selection UI,
  * resets the search contact field, and refreshes the searched contacts list.
  *
  * @public
  * @returns {void}
  */
  public closeContactsAndCategory(): void {
    this.addTaskService.showContacts = false;
    this.addTaskService.showCategory = false;
    this.taskForm.get('searchContact')?.reset();
    this.addTaskService.searchedContact = this.firebaseDatabaseService.contacts;
  }

  /**
  * Clears the subtask form by resetting the task and priority states,
  * marking all contacts as unselected, and reinitializing the task form.
  *
  * @public
  * @returns {void}
  */
  public clearSubtaskForm(): void {
    this.addTaskService.resetTask();
    this.addTaskService.resetPrio();
    this.addTaskService.isCategoryInvalid = false;
    this.firebaseDatabaseService.contacts.forEach(contact => {
      contact.selected = false;
    });
    this.setupTaskForm();
  }

  /**
  * Creates a task if the form is valid and the selected category is not the default.
  * It sorts the tasks by status and handles navigation with a timeout.
  *
  * @public
  * @returns {Promise<void>} - A promise that resolves when the task creation process is complete.
  */
  public async createTask(): Promise<void> {
    if (this.taskForm.valid && this.taskForm.get('selectCategory')?.value !== 'Select task category') {
      await this.firebaseDatabaseService.sortTasksByStatus(this.addTaskService.task);
      this.handleSetTimeoutAndNavigate();
    }
    this.showErrorMessage();
  }

  /**
  * Displays error messages based on the validity of the form fields.
  * Marks title, due date, and category as invalid if they do not meet the validation criteria.
  *
  * @public
  * @returns {void}
  */
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

  /**
  * Checks if the current URL includes '/home/addTask'.
  *
  * @public
  * @returns {boolean} - Returns true if the current URL matches, otherwise false.
  */
  public checkCurrentUrl(): boolean {
    if (this.router.url.includes('/home/addTask')) {
      return true;
    } else {
      return false;
    }
  }

  /**
  * Handles the navigation to the board after a timeout,
  * disables the element during the transition and shows a task creation message.
  *
  * @private
  * @returns {void}
  */
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

  /**
  * Moves the current user to the front of the assigned contacts list.
  * It marks all contacts as unselected and ensures the user's contact is displayed first.
  *
  * @private
  * @returns {void}
  */
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
