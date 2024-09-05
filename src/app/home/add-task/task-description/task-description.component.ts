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

  public descriptionValue(value: string): void {
    this.addTaskService.tasks.description = value;
  }
}
