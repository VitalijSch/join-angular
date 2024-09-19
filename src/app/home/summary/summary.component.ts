import { Component, inject } from '@angular/core';
import { FirebaseAuthenticationService } from '../../services/firebase-authentication/firebase-authentication.service';
import { HomeService } from '../../services/home/home.service';
import { BoardService } from '../../services/board/board.service';
import { FirebaseDatabaseService } from '../../services/firebase-database/firebase-database.service';
import { Task } from '../../interfaces/task';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
  public firebaseAuthenticationService: FirebaseAuthenticationService = inject(FirebaseAuthenticationService);
  public firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);
  public boardService: BoardService = inject(BoardService);
  public homeService: HomeService = inject(HomeService);

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

  public getUrgentCount(): number {
    const countToDo = this.boardService.toDo().filter(task => task.prio === 'Urgent');
    const countInProgress = this.boardService.inProgress().filter(task => task.prio === 'Urgent');
    const countAwaitFeedback = this.boardService.awaitFeedback().filter(task => task.prio === 'Urgent');
    const countDone = this.boardService.done().filter(task => task.prio === 'Urgent');
    return countToDo.length + countInProgress.length + countAwaitFeedback.length + countDone.length;
  }

  public getUpcomingDeadline(): string | null {
    const now = new Date();
    const tasks = this.firebaseDatabaseService.tasks();
    if (tasks.length === 0) {
      return null;
    }
    const urgentUpcomingTasks = this.filterUrgentFutureTasks(tasks, now);
    const sortedTasks = this.sortTasksByDueDate(urgentUpcomingTasks);
    if (typeof sortedTasks !== 'string') {
      const formattedDate = this.formatTaskDueDate(sortedTasks);
      return formattedDate;
    } else {
      return 'None';
    }
  }

  private filterUrgentFutureTasks(tasks: Task[], now: Date): Task[] {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return task.prio === 'Urgent' && taskDate > now;
    });
  }

  private sortTasksByDueDate(tasks: Task[]): Task[] | string {
    if (tasks.length === 0) {
      return 'None';
    }
    return tasks.sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return dateA - dateB;
    });
  }

  private formatTaskDueDate(sortedTasks: Task[]): string {
    const upcomingDate = new Date(sortedTasks[0].dueDate);
    return upcomingDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
