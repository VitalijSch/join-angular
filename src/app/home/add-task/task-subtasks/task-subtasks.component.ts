import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-subtasks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-subtasks.component.html',
  styleUrl: './task-subtasks.component.scss'
})
export class TaskSubtasksComponent {
  @Input() taskForm!: FormGroup;

  public subtasks: string[] = [];

  public showEditSubtask: boolean = false;

  public resetSubtaskInput(): void {
    this.taskForm.get('subtasks')?.reset();
  }

  public saveSubtasks(): void {
    const subtask = this.taskForm.get('subtasks')?.value;
    this.subtasks.push(subtask);
    this.resetSubtaskInput();
  }

  public deleteSubtask(index: number): void {
    this.subtasks.splice(index, 1);
  }

  public toggleShowEditSubtask(): void {
    this.showEditSubtask = !this.showEditSubtask;
    if(this.showEditSubtask) {
      this.taskForm.get('')
    }
  }
}
