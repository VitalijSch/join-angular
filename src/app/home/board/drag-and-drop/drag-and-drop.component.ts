import { Component, inject } from '@angular/core';
import { FirebaseDatabaseService } from '../../../services/firebase-database/firebase-database.service';
import { TaskComponent } from './task/task.component';
import { BoardService } from '../../../services/board/board.service';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Task } from '../../../interfaces/task';
import { AddTaskService } from '../../../services/add-task/add-task.service';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../../services/home/home.service';

@Component({
  selector: 'app-drag-and-drop',
  standalone: true,
  imports: [TaskComponent, DragDropModule, CommonModule],
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropComponent {
  public firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);
  public boardService: BoardService = inject(BoardService);

  private addTaskService: AddTaskService = inject(AddTaskService);
  private homeService: HomeService = inject(HomeService);

  /**
   * Handles the drop event for dragging and dropping tasks.
   *
   * This asynchronous method is triggered when a task is dropped into a 
   * different list. It removes the dragged task from its current list, 
   * adds it to the new list based on the drop event, and updates the 
   * task list in the Firebase database.
   *
   * @param {CdkDragDrop<Task>} event - The drop event containing the dragged task.
   * @returns {Promise<void>} - A promise that resolves when the task list is updated.
   * @public
   */
  public async onDrop(event: CdkDragDrop<Task>): Promise<void> {
    const draggedTask = event.item.data;
    this.removeDraggedTask(draggedTask);
    this.addDraggedTaskToList(event, draggedTask);
    await this.firebaseDatabaseService.updateTaskList(this.firebaseDatabaseService.taskList);
  }

  /**
  * Shows the add task interface based on the specified status and screen width.
  *
  * This method sets the status of the addTaskService to the provided status.
  * If the screen width is less than or equal to 1080 pixels, it navigates 
  * to the add task route; otherwise, it toggles the visibility of the 
  * add task interface on the board.
  *
  * @param {string} status - The status to set for the addTaskService.
  * @public
  */
  public showAddTaskWithRightStatus(status: string): void {
    const screenWidth = window.innerWidth;
    this.addTaskService.status = status;
    if (screenWidth <= 1080) {
      this.homeService.navigateToRoute('addTask');
    } else {
      this.boardService.toggleShowAddTask();
    }
  }

  /**
  * Removes the dragged task from all task lists.
  *
  * This private method iterates through all task lists and removes the 
  * specified dragged task if it exists in any of the lists.
  *
  * @param {any} draggedTask - The task object that is being dragged and dropped.
  * @private
  */
  private removeDraggedTask(draggedTask: any): void {
    const lists = [
      this.firebaseDatabaseService.taskList.toDo,
      this.firebaseDatabaseService.taskList.inProgress,
      this.firebaseDatabaseService.taskList.awaitFeedback,
      this.firebaseDatabaseService.taskList.done
    ];
    lists.forEach(list => {
      const taskIndex = list.findIndex(task => task === draggedTask);
      if (taskIndex !== -1) {
        list.splice(taskIndex, 1)[0];
      }
    });
  }

  /**
  * Adds the dragged task to the appropriate list based on the drop event.
  *
  * This private method determines which list the dragged task should be 
  * added to based on the drop event's container ID and current index. 
  * It updates the corresponding list in the task list.
  *
  * @param {CdkDragDrop<Task>} event - The drop event containing the target container information.
  * @param {any} draggedTask - The task object that has been dragged and is being added to the new list.
  * @private
  */
  private addDraggedTaskToList(event: CdkDragDrop<Task>, draggedTask: any): void {
    const currentContainerId = event.container.id;
    const currentIndex = event.currentIndex;
    if (currentContainerId === 'toDoList') {
      this.firebaseDatabaseService.taskList.toDo.splice(currentIndex, 0, draggedTask);
    } else if (currentContainerId === 'inProgressList') {
      this.firebaseDatabaseService.taskList.inProgress.splice(currentIndex, 0, draggedTask);
    } else if (currentContainerId === 'awaitFeedbackList') {
      this.firebaseDatabaseService.taskList.awaitFeedback.splice(currentIndex, 0, draggedTask);
    } else if (currentContainerId === 'doneList') {
      this.firebaseDatabaseService.taskList.done.splice(currentIndex, 0, draggedTask);
    }
  }
}
