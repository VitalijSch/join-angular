import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Task } from '../../../../interfaces/task';
import { BoardService } from '../../../../services/board/board.service';
import { FirebaseDatabaseService } from '../../../../services/firebase-database/firebase-database.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  @Input() task!: Task;

  public boardService: BoardService = inject(BoardService);

  private firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);

  /**
   * Gets the count of checked subtasks for the currently selected task.
   *
   * This method iterates through the tasks in the Firebase database and
   * counts how many subtasks are marked as checked for the task that 
   * matches the currently selected task.
   *
   * @returns {number} - The count of checked subtasks.
   * @public
   */
  public getCheckedSubtasksCount(): number {
    let countCheckedSubtasks = 0;
    this.firebaseDatabaseService.tasks.forEach(task => {
      if (task === this.task) {
        task.subtasks.forEach(subtask => {
          if (subtask.checked) {
            countCheckedSubtasks++;
          }
        });
      }
    });
    return countCheckedSubtasks;
  }

  /**
  * Displays the selected task in a larger view.
  *
  * This method triggers the display of a big card for the selected task 
  * by toggling the visibility in the board service and sets the selected 
  * task to the provided task parameter.
  *
  * @param {Task} task - The task to be displayed.
  * @public
  */
  public showSelectedTask(task: Task): void {
    this.boardService.toggleShowBigCardTask();
    this.boardService.selectedTask = task;
  }
}
