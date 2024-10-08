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

  public async onDrop(event: CdkDragDrop<Task>): Promise<void> {
    const draggedTask = event.item.data;
    this.removeDraggedTask(draggedTask);
    this.addDraggedTaskToList(event, draggedTask);
    await this.firebaseDatabaseService.updateTaskList(this.firebaseDatabaseService.taskList);
  }

  public showAddTaskWithRightStatus(status: string): void {
    const screenWidth = window.innerWidth;
    this.addTaskService.status = status;
    if (screenWidth <= 1080) {
      this.homeService.navigateToRoute('addTask');
    } else {
      this.boardService.toggleShowAddTask();
    }
  }

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
