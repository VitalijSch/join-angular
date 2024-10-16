import { Component, inject } from '@angular/core';
import { AddTaskService } from '../../../services/add-task/add-task.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-description',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-description.component.html',
  styleUrl: './task-description.component.scss'
})
export class TaskDescriptionComponent {
  public addTaskService: AddTaskService = inject(AddTaskService);

  /**
   * Sets the description of the task to the specified value.
   *
   * @public
   * @param {string} value - The description to set for the task.
   * @returns {void}
   */
  public descriptionValue(value: string): void {
    this.addTaskService.task.description = value;
  }
}
