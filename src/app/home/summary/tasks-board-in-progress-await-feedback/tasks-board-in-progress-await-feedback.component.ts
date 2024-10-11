import { Component, inject, Input } from '@angular/core';
import { FirebaseDatabaseService } from '../../../services/firebase-database/firebase-database.service';
import { HomeService } from '../../../services/home/home.service';

@Component({
  selector: 'app-tasks-board-in-progress-await-feedback',
  standalone: true,
  imports: [],
  templateUrl: './tasks-board-in-progress-await-feedback.component.html',
  styleUrl: './tasks-board-in-progress-await-feedback.component.scss'
})
export class TasksBoardInProgressAwaitFeedbackComponent {
  @Input() taskStatus!: string;

  public firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);
  public homeService: HomeService = inject(HomeService);

  /**
   * Gets the length of the task list based on the current task status.
   *
   * This method checks the current task status and returns the number of tasks
   * in the corresponding list. 
   * - If the status is 'Task in Board', it returns the total number of tasks.
   * - If the status is 'Task in Progress', it returns the count of tasks that are in progress.
   * - For any other status, it returns the count of tasks awaiting feedback.
   *
   * @returns {number} The number of tasks in the specified status list.
   */
  public getTaskStatusLength(): number {
    if (this.taskStatus === 'Task in Board') {
      return this.firebaseDatabaseService.tasks.length;
    } else if (this.taskStatus === 'Task in Progress') {
      return this.firebaseDatabaseService.taskList.inProgress.length;
    } else {
      return this.firebaseDatabaseService.taskList.awaitFeedback.length;
    }
  }
}
