import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AddTaskService } from '../../../services/add-task/add-task.service';

@Component({
  selector: 'app-task-due-date',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-due-date.component.html',
  styleUrl: './task-due-date.component.scss'
})
export class TaskDueDateComponent {
  @Input() taskForm!: FormGroup;

  public addTaskService: AddTaskService = inject(AddTaskService);

  /**
   * Gets the current date in the format YYYY-MM-DD.
   *
   * @public
   * @returns {string} The current date as a string in the format 'YYYY-MM-DD'.
   */
  public getToday(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
  * Opens the date picker for the input element that triggered the event.
  *
  * @public
  * @param {MouseEvent} event - The mouse event triggered by the user.
  * @returns {void}
  */
  public openDatepicker(event: MouseEvent): void {
    (event.target as HTMLInputElement).showPicker();
  }

  /**
  * Sets the due date of the task to the specified value.
  *
  * @public
  * @param {string} value - The due date to set, formatted as 'YYYY-MM-DD'.
  * @returns {void}
  */
  public dueDateValue(value: string): void {
    this.addTaskService.task.dueDate = value;
  }
}
