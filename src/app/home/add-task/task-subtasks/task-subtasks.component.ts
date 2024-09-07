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

  public resetSubtaskInput(): void {
    this.taskForm.get('subtasks')?.reset();
  }

  public saveSubtasks(): void {
    const content = this.taskForm.get('subtasks')?.value;
    const subtask = {
      content,
      isEditing: false
    }
    this.addTaskService.task.subtasks.push(subtask);
    this.resetSubtaskInput();
  }

  public deleteSubtask(index: number): void {
    this.addTaskService.task.subtasks.splice(index, 1);
  }

  public toggleShowEditSubtask(index: number): void {
    const isEditing = this.addTaskService.task.subtasks[index].isEditing;
    this.addTaskService.task.subtasks[index].isEditing = !isEditing;
  }

  public saveEditSubtask(index: number, value: string): void {
    this.addTaskService.task.subtasks[index].content = value;
    this.toggleShowEditSubtask(index);
  }
}
