import { Component, inject } from '@angular/core';
import { FirebaseAuthenticationService } from '../../services/firebase-authentication/firebase-authentication.service';
import { HomeService } from '../../services/home/home.service';
import { BoardService } from '../../services/board/board.service';
import { FirebaseDatabaseService } from '../../services/firebase-database/firebase-database.service';
import { AddTaskService } from '../../services/add-task/add-task.service';
import { ToDoAndDoneComponent } from './to-do-and-done/to-do-and-done.component';
import { UrgentComponent } from './urgent/urgent.component';
import { TasksBoardInProgressAwaitFeedbackComponent } from './tasks-board-in-progress-await-feedback/tasks-board-in-progress-await-feedback.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [ToDoAndDoneComponent, UrgentComponent, TasksBoardInProgressAwaitFeedbackComponent, CommonModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
  public firebaseAuthenticationService: FirebaseAuthenticationService = inject(FirebaseAuthenticationService);
  public firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);
  public boardService: BoardService = inject(BoardService);
  public homeService: HomeService = inject(HomeService);

  private addTaskService: AddTaskService = inject(AddTaskService);

  /**
   * Initializes the component.
   * 
   * This method sets the status of the task service to an empty string
   * when the component is initialized.
   */
  public ngOnInit(): void {
    this.addTaskService.status = '';
  }

  /**
  * Generates a greeting based on the current time of day.
  * 
  * @returns {string} A greeting message: "Good morning", "Good afternoon", or "Good evening"
  * depending on the current hour.
  */
  public getGreeting(): string {
    const now = new Date();
    const hours = now.getHours();
    if (hours >= 0 && hours < 12) {
      return 'Good morning';
    } else if (hours >= 12 && hours < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  }
}
