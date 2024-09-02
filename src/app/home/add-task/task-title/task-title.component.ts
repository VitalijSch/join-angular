import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-title',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-title.component.html',
  styleUrl: './task-title.component.scss'
})
export class TaskTitleComponent {
  @Input() taskForm!: FormGroup;
}
