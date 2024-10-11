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
import { Task } from '../../../../interfaces/task';

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
  public showCreateTaskMessage: boolean = false;

  public taskForm!: FormGroup;

  public homeService: HomeService = inject(HomeService);
  public firebaseAuthenticationService: FirebaseAuthenticationService = inject(FirebaseAuthenticationService);
  public firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);
  public addTaskService: AddTaskService = inject(AddTaskService);
  public boardService: BoardService = inject(BoardService);

  private fb: FormBuilder = inject(FormBuilder);

  private lists = [
    this.firebaseDatabaseService.taskList.toDo,
    this.firebaseDatabaseService.taskList.inProgress,
    this.firebaseDatabaseService.taskList.awaitFeedback,
    this.firebaseDatabaseService.taskList.done
  ];

  /**
   * Initializes the component by setting up the task form and 
   * assigning the selected task to the add task service.
   *
   * This method is called when the component is initialized. It retrieves
   * the selected task from the board service, sets it in the add task 
   * service, and initializes the task form with the task's details.
   *
   * @public
   * @returns {void}
   */
  public ngOnInit(): void {
    const task = this.boardService.selectedTask;
    if (task) {
      this.addTaskService.task = task;
    }
    this.setupTaskForm();
    this.addTaskService.task.status = this.addTaskService.status;
  }

  /**
  * Sets up the task form with validators and default values.
  *
  * This private method initializes the task form with form controls for 
  * title, searchContact, dueDate, selectCategory, and subtasks. 
  * It uses the FormBuilder service to create the form group and applies 
  * validation rules.
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
  * Closes the contacts and category dropdowns in the task form.
  *
  * This public method hides the contacts and category selection interfaces
  * in the task form. It also resets the search contact input and updates 
  * the searched contacts list to include all available contacts.
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
  * Closes the edit task interface.
  *
  * This public method iterates over the tasks and sets the selected task 
  * in the board service to the first task that is not the currently 
  * selected task. It also toggles the visibility of the edit task interface.
  *
  * @public
  * @returns {void}
  */
  public closeEditTask(): void {
    this.firebaseDatabaseService.tasks.forEach(task => {
      if (task !== this.boardService.selectedTask) {
        this.boardService.selectedTask = task;
      }
    });
    this.boardService.toggleShowEditTask();
  }

  /**
  * Creates or updates a task based on the form data.
  *
  * This public asynchronous method checks if the task form is valid and 
  * updates the relevant task in the task list if it is. It then updates 
  * the Firebase database with the modified task list and toggles the 
  * visibility of the edit task interface.
  *
  * @public
  * @returns {Promise<void>} - A promise that resolves when the task has been created or updated.
  */
  public async createTask(): Promise<void> {
    if (this.taskForm.valid && this.taskForm.get('selectCategory')?.value !== 'Select task category') {
      this.lists.forEach(list => {
        let task: Task = list.filter(task => task === this.addTaskService.task)[0];
        task = this.addTaskService.task;
      });
      await this.firebaseDatabaseService.updateTaskList(this.firebaseDatabaseService.taskList);
      this.boardService.toggleShowEditTask();
    }
    this.showErrorMessage();
  }

  /**
  * Displays error messages for invalid form fields.
  *
  * This public method checks each field of the task form for validity. 
  * If any field is invalid, it sets the corresponding error flags in 
  * the add task service to true, which can be used for displaying 
  * validation messages in the UI.
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
}
