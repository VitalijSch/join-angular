import { Injectable } from '@angular/core';
import { Task } from '../../interfaces/task';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  public showEditTask: boolean = false;

  public selectedTask: Task | null = null;

  public toggleShowEditTask(): void {
    this.showEditTask = !this.showEditTask;
    if (!this.showEditTask) {
      this.selectedTask = null;
    }
  }

  public getSelectedTask(task: Task): void {
    this.selectedTask = task;
  }
}
