import { Component, inject, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AddTaskService } from '../../../services/add-task/add-task.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-category.component.html',
  styleUrl: './task-category.component.scss'
})
export class TaskCategoryComponent {
  @Input() taskForm!: FormGroup;

  public addTaskService: AddTaskService = inject(AddTaskService);

  /**
   * Sets the selected category for the task and updates the form control value.
   *
   * @public
   * @param {string} category - The category to set for the task.
   * @returns {void}
   */
  public selectedCategory(category: string): void {
    this.addTaskService.toggleShowCategory();
    this.taskForm.get('selectCategory')?.setValue(`${category}`);
    this.addTaskService.task.category = category;
  }
}
