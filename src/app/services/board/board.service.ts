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

  /**
 * Updates the search task status by emitting a new value to the `searchTaskSource` observable.
 * 
 * @param {boolean} status - The search task status to emit (true or false).
 */
  public updateSearchTask(status: boolean) {
    this.searchTaskSource.next(status);
  }

  /**
 * Toggles the visibility of the big card task view.
 * If `showBigCardTask` is toggled off, the `selectedTask` is set to null and `showEditTask` is hidden.
 */
  public toggleShowBigCardTask(): void {
    this.showBigCardTask = !this.showBigCardTask;
    this.showEditTask = false;
    if (!this.showBigCardTask) {
      this.selectedTask = null;
    }
  }

  /**
 * Toggles the visibility of the add task form.
 * Toggles the `showAddTask` boolean to show or hide the add task form.
 */
  public toggleShowAddTask(): void {
    this.showAddTask = !this.showAddTask;
  }

  /**
 * Toggles the visibility of the edit task form.
 * Toggles the `showEditTask` boolean to show or hide the edit task form.
 */
  public toggleShowEditTask(): void {
    this.showEditTask = !this.showEditTask;
  }
}
