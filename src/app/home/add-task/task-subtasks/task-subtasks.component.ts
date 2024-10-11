import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AddTaskService } from '../../../services/add-task/add-task.service';

@Component({
  selector: 'app-task-subtasks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-subtasks.component.html',
  styleUrl: './task-subtasks.component.scss'
})
export class TaskSubtasksComponent {
  @Input() taskForm!: FormGroup;

  public addTaskService: AddTaskService = inject(AddTaskService);

  /**
   * Resets the input for subtasks in the task form.
   *
   * @public
   * @returns {void}
   */
  public resetSubtaskInput(): void {
    this.taskForm.get('subtasks')?.reset();
  }

  /**
  * Saves the current subtask input to the list of subtasks in the task.
  * It creates a new subtask object with the current content, marks it as not editing, and not checked.
  *
  * @public
  * @returns {void}
  */
  public saveSubtasks(): void {
    const content = this.taskForm.get('subtasks')?.value;
    const subtask = {
      content,
      isEditing: false,
      checked: false
    }
    this.addTaskService.task.subtasks.push(subtask);
    this.resetSubtaskInput();
  }

  /**
  * Deletes a subtask from the list of subtasks based on the provided index.
  *
  * @public
  * @param {number} index - The index of the subtask to be deleted.
  * @returns {void}
  */
  public deleteSubtask(index: number): void {
    this.addTaskService.task.subtasks.splice(index, 1);
  }

  /**
  * Toggles the editing state of a subtask at the specified index.
  * If the subtask is currently being edited, it will stop editing and vice versa.
  *
  * @public
  * @param {number} index - The index of the subtask to toggle editing state.
  * @returns {void}
  */
  public toggleShowEditSubtask(index: number): void {
    const isEditing = this.addTaskService.task.subtasks[index].isEditing;
    this.addTaskService.task.subtasks[index].isEditing = !isEditing;
  }

  /**
  * Saves the edited content of a subtask at the specified index and toggles its editing state.
  *
  * @public
  * @param {number} index - The index of the subtask to be edited.
  * @param {string} value - The new content to be set for the subtask.
  * @returns {void}
  */
  public saveEditSubtask(index: number, value: string): void {
    this.addTaskService.task.subtasks[index].content = value;
    this.toggleShowEditSubtask(index);
  }
}
