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

  /**
   * Counts the number of tasks marked as 'Urgent' across all task statuses.
   * 
   * This method filters the tasks in each status category (To Do, In Progress,
   * Awaiting Feedback, Done) and returns the total count of tasks with
   * 'Urgent' priority.
   * 
   * @returns {number} The total count of urgent tasks.
   */
  public getUrgentCount(): number {
    const countToDo = this.firebaseDatabaseService.taskList.toDo.filter(task => task.prio === 'Urgent');
    const countInProgress = this.firebaseDatabaseService.taskList.inProgress.filter(task => task.prio === 'Urgent');
    const countAwaitFeedback = this.firebaseDatabaseService.taskList.awaitFeedback.filter(task => task.prio === 'Urgent');
    const countDone = this.firebaseDatabaseService.taskList.done.filter(task => task.prio === 'Urgent');
    return countToDo.length + countInProgress.length + countAwaitFeedback.length + countDone.length;
  }

  /**
  * Gets the upcoming deadline for urgent tasks.
  * 
  * This method retrieves urgent tasks that have a due date in the future
  * and formats the earliest upcoming deadline. If there are no tasks,
  * it returns null.
  * 
  * @returns {string | null} A formatted string representing the upcoming 
  * deadline for urgent tasks or null if no tasks exist.
  */
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

  /**
  * Formats the upcoming deadlines of urgent tasks.
  * 
  * If sortedTasks is not a string, it formats the due date of the first 
  * task. If sortedTasks is a string, it returns 'None'.
  * 
  * @param {string | Task[]} sortedTasks - The sorted list of tasks or 'None'.
  * @returns {string} A formatted date string or 'None'.
  */
  private getFormattedUrgentUpcomingTasks(sortedTasks: string | Task[]): string {
    if (typeof sortedTasks !== 'string') {
      const formattedDate = this.formatTaskDueDate(sortedTasks);
      return formattedDate;
    } else {
      return 'None';
    }
  }

  /**
  * Filters the tasks to retrieve only those that are urgent and have a due date in the future.
  * 
  * @param {Task[]} tasks - An array of tasks to filter.
  * @param {Date} now - The current date to compare against task due dates.
  * @returns {Task[]} An array of urgent future tasks.
  */
  private filterUrgentFutureTasks(tasks: Task[], now: Date): Task[] {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return task.prio === 'Urgent' && taskDate > now;
    });
  }

  /**
  * Sorts tasks by their due date.
  * 
  * If no tasks are provided, it returns 'None'. Otherwise, it sorts
  * the tasks in ascending order based on their due date.
  * 
  * @param {Task[]} tasks - An array of tasks to sort.
  * @returns {Task[] | string} An array of sorted tasks or 'None'.
  */
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

  /**
  * Formats the due date of the first task in a sorted array.
  * 
  * @param {Task[]} sortedTasks - An array of sorted tasks.
  * @returns {string} A formatted string representation of the due date.
  */
  private formatTaskDueDate(sortedTasks: Task[]): string {
    const upcomingDate = new Date(sortedTasks[0].dueDate);
    return upcomingDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
