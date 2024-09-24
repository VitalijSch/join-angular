import { Injectable } from '@angular/core';
import { Task } from '../../interfaces/task';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  public showBigCardTask: boolean = false;
  public showAddTask: boolean = false;
  public showEditTask: boolean = false;

  public selectedTask: Task | null = null;

  private searchTaskSource = new BehaviorSubject<boolean>(false);
  public searchedTask = this.searchTaskSource.asObservable();

  public updateSearchTask(status: boolean) {
    this.searchTaskSource.next(status);
  }

  public toggleShowBigCardTask(): void {
    this.showBigCardTask = !this.showBigCardTask;
    this.showEditTask = false;
    if (!this.showBigCardTask) {
      this.selectedTask = null;
    }
  }

  public toggleShowAddTask(): void {
    this.showAddTask = !this.showAddTask;
  }

  public toggleShowEditTask(): void {
    this.showEditTask = !this.showEditTask;
  }
}
