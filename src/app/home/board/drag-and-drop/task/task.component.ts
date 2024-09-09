import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Task } from '../../../../interfaces/task';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  @Input() task!: Task;
}
