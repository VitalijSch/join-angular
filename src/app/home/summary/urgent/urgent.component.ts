import { Component, inject } from '@angular/core';
import { FirebaseDatabaseService } from '../../../services/firebase-database/firebase-database.service';
import { HomeService } from '../../../services/home/home.service';
import { Task } from '../../../interfaces/task';

@Component({
  selector: 'app-urgent',
  standalone: true,
  imports: [],
  templateUrl: './urgent.component.html',
  styleUrl: './urgent.component.scss'
})
export class UrgentComponent {
  public firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);
  public homeService: HomeService = inject(HomeService);

  public getUrgentCount(): number {
    const countToDo = this.firebaseDatabaseService.taskList.toDo.filter(task => task.prio === 'Urgent');
    const countInProgress = this.firebaseDatabaseService.taskList.inProgress.filter(task => task.prio === 'Urgent');
    const countAwaitFeedback = this.firebaseDatabaseService.taskList.awaitFeedback.filter(task => task.prio === 'Urgent');
    const countDone = this.firebaseDatabaseService.taskList.done.filter(task => task.prio === 'Urgent');
    return countToDo.length + countInProgress.length + countAwaitFeedback.length + countDone.length;
  }

  public getUpcomingDeadline(): string | null {
    const now = new Date();
    const tasks = this.firebaseDatabaseService.tasks;
    if (tasks.length === 0) {
      return null;
    }
    const urgentUpcomingTasks = this.filterUrgentFutureTasks(tasks, now);
    const sortedTasks = this.sortTasksByDueDate(urgentUpcomingTasks);
    return this.getFormattedUrgentUpcomingTasks(sortedTasks);
  }

  private getFormattedUrgentUpcomingTasks(sortedTasks: string | Task[]): string {
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
