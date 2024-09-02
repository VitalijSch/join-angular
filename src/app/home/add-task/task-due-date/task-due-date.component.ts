import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-due-date',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-due-date.component.html',
  styleUrl: './task-due-date.component.scss'
})
export class TaskDueDateComponent {
  @Input() taskForm!: FormGroup;

  public getToday(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  public openDatepicker(event: MouseEvent): void {
    (event.target as HTMLInputElement).showPicker();
  }
}
