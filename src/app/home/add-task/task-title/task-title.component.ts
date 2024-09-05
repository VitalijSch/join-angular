import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AddTaskService } from '../../../services/add-task/add-task.service';

@Component({
  selector: 'app-task-title',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-title.component.html',
  styleUrl: './task-title.component.scss'
})
export class TaskTitleComponent {
  @Input() taskForm!: FormGroup;

  public addTaskService: AddTaskService = inject(AddTaskService);

  public titleValue(value: string): void {
    this.addTaskService.tasks.title = value;
  }
}
