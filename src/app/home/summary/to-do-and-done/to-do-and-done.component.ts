import { Component, inject, Input } from '@angular/core';
import { FirebaseDatabaseService } from '../../../services/firebase-database/firebase-database.service';
import { HomeService } from '../../../services/home/home.service';

@Component({
  selector: 'app-to-do-and-done',
  standalone: true,
  imports: [],
  templateUrl: './to-do-and-done.component.html',
  styleUrl: './to-do-and-done.component.scss'
})
export class ToDoAndDoneComponent {
  @Input() taskStatus!: string;

  public firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);
  public homeService: HomeService = inject(HomeService);

  /**
   * Gets the length of the task list based on the current task status.
   * 
   * This method checks the current task status and returns the number of tasks
   * in the corresponding list. If the status is 'To-do', it returns the count
   * of tasks that are still pending. If the status is anything else (e.g., 'Done'),
   * it returns the count of completed tasks.
   * 
   * @returns {number} The number of tasks in the specified status list.
   */
  public getTaskStatusLength(): number {
    if (this.taskStatus === 'To-do') {
      return this.firebaseDatabaseService.taskList.toDo.length;
    } else {
      return this.firebaseDatabaseService.taskList.done.length;
    }
  }
}
