import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BoardService } from '../../../services/board/board.service';
import { FirebaseDatabaseService } from '../../../services/firebase-database/firebase-database.service';
import { EditTaskComponent } from "./edit-task/edit-task.component";
import { Task } from '../../../interfaces/task';

@Component({
  selector: 'app-big-card-task',
  standalone: true,
  imports: [CommonModule, EditTaskComponent],
  templateUrl: './big-card-task.component.html',
  styleUrl: './big-card-task.component.scss'
})
export class BigCardTaskComponent {
  public boardService: BoardService = inject(BoardService);

  private firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);

  private lists = [
    this.firebaseDatabaseService.taskList.toDo,
    this.firebaseDatabaseService.taskList.inProgress,
    this.firebaseDatabaseService.taskList.awaitFeedback,
    this.firebaseDatabaseService.taskList.done
  ];

  /**
   * Toggles the checked status of a subtask for a given task.
   *
   * This method checks the subtask at the specified index for the current task
   * and updates its checked status. It also updates the selected task in the 
   * board service and the Firebase database.
   *
   * @param {Task} currentTask - The current task whose subtask is being checked.
   * @param {number} index - The index of the subtask to be toggled.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   * @public
   */
  public async checkedSubtask(currentTask: Task, index: number): Promise<void> {
    for (const task of this.firebaseDatabaseService.tasks) {
      if (currentTask === task) {
        task.subtasks[index].checked = !task.subtasks[index].checked;
        this.boardService.selectedTask = task;
        this.updateSelectedTaskInLists();
        await this.firebaseDatabaseService.updateTaskList(this.firebaseDatabaseService.taskList);
      }
    }
  }

  /**
  * Deletes a task from the task list.
  *
  * This method hides the big card for the selected task and removes the task 
  * from the Firebase database. It updates the task list accordingly.
  *
  * @param {Task} t - The task to be deleted.
  * @returns {Promise<void>} - A promise that resolves when the operation is complete.
  * @public
  */
  public async deleteTask(t: Task): Promise<void> {
    this.boardService.toggleShowBigCardTask();
    this.spliceTaskFromTaskList(t);
    await this.firebaseDatabaseService.updateTaskList(this.firebaseDatabaseService.taskList);
  }

  /**
  * Formats the due date of the currently selected task.
  *
  * This method retrieves the due date of the selected task and formats it 
  * from 'YYYY-MM-DD' to 'DD/MM/YYYY'. If no due date is set, it returns an empty string.
  *
  * @returns {string} - The formatted due date or an empty string if no date is set.
  * @public
  */
  public formattedDate(): string {
    const formattedDate = this.boardService.selectedTask?.dueDate;
    if (formattedDate) {
      return formattedDate.split('-').reverse().join('/');
    } else {
      return '';
    }
  }

  /**
  * Removes a task from all task lists.
  *
  * This private method iterates through the lists and removes the specified 
  * task from each list if it exists.
  *
  * @param {Task} t - The task to be removed from the lists.
  * @returns {void}
  * @private
  */
  private spliceTaskFromTaskList(t: Task): void {
    this.lists.forEach(list => {
      const index = list.findIndex(task => task === t);
      if (index !== -1) {
        list.splice(index, 1);
      }
    });
  }

  /**
  * Updates the selected task in all task lists.
  *
  * This private method ensures that the current state of the selected task
  * is reflected in all task lists. It finds the selected task in each list 
  * and updates it with the current state.
  *
  * @returns {void}
  * @private
  */
  private updateSelectedTaskInLists(): void {
    this.lists.forEach(list => {
      const taskIndex = list.findIndex(task => task === this.boardService.selectedTask);
      if (taskIndex !== -1 && this.boardService.selectedTask) {
        list[taskIndex] = this.boardService.selectedTask;
      }
    });
  }
}
