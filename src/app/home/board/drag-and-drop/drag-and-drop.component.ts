import { Component, inject } from '@angular/core';
import { FirebaseDatabaseService } from '../../../services/firebase-database/firebase-database.service';
import { TaskComponent } from './task/task.component';
import { BoardService } from '../../../services/board/board.service';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Task } from '../../../interfaces/task';

@Component({
  selector: 'app-drag-and-drop',
  standalone: true,
  imports: [TaskComponent, DragDropModule],
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropComponent {
  public firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);
  public boardService: BoardService = inject(BoardService);

  public async onDrop(event: CdkDragDrop<Task>): Promise<void> {
    const draggedTask = event.item.data;
    const currentContainerId = event.container.id;
    const currentIndex = event.currentIndex;
    const lists = [
      this.firebaseDatabaseService.taskList.toDo,
      this.firebaseDatabaseService.taskList.inProgress,
      this.firebaseDatabaseService.taskList.awaitFeedback,
      this.firebaseDatabaseService.taskList.done
    ];
    lists.forEach(list => {
      const taskIndex = list.findIndex(task => task === draggedTask);
      const task = list.splice(taskIndex, 1)[0];
      if (currentContainerId === 'toDoList') {
        this.firebaseDatabaseService.taskList.toDo.splice(currentIndex, 0, task);
      } else if (currentContainerId === 'inProgressList') {
        this.firebaseDatabaseService.taskList.inProgress.splice(currentIndex, 0, task);
      } else if (currentContainerId === 'awaitFeedbackList') {
        this.firebaseDatabaseService.taskList.awaitFeedback.splice(currentIndex, 0, task);
      } else if (currentContainerId === 'doneList') {
        this.firebaseDatabaseService.taskList.done.splice(currentIndex, 0, task);
      }
    });
    //   // await this.firebaseDatabaseService.sortTasksByStatus(this.firebaseDatabaseService.tasks);
    //   if (currentContainerId === 'toDoList') {
    //     const taskIndex = this.firebaseDatabaseService.taskList.toDo.findIndex(todo => todo.id === this.firebaseDatabaseService.tasks[index].id);
    //     if (taskIndex !== -1) {
    //       const task = this.firebaseDatabaseService.taskList.toDo.splice(taskIndex, 1)[0];
    //       this.firebaseDatabaseService.taskList.toDo.splice(currentIndex, 0, task);
    //     }
    //   } else if (currentContainerId === 'inProgressList') {
    //     const taskIndex = this.firebaseDatabaseService.taskList.inProgress.findIndex(todo => todo.id === this.firebaseDatabaseService.tasks[index].id);
    //     if (taskIndex !== -1) {
    //       const task = this.firebaseDatabaseService.taskList.inProgress.splice(taskIndex, 1)[0];
    //       this.firebaseDatabaseService.taskList.inProgress.splice(currentIndex, 0, task);
    //     }
    //   } else if (currentContainerId === 'awaitFeedbackList') {
    //     const taskIndex = this.firebaseDatabaseService.taskList.awaitFeedback.findIndex(todo => todo.id === this.firebaseDatabaseService.tasks[index].id);
    //     if (taskIndex !== -1) {
    //       const task = this.firebaseDatabaseService.taskList.awaitFeedback.splice(taskIndex, 1)[0];
    //       this.firebaseDatabaseService.taskList.awaitFeedback.splice(currentIndex, 0, task);
    //     }
    //   } else if (currentContainerId === 'doneList') {
    //     const taskIndex = this.firebaseDatabaseService.taskList.done.findIndex(todo => todo.id === this.firebaseDatabaseService.tasks[index].id);
    //     if (taskIndex !== -1) {
    //       const task = this.firebaseDatabaseService.taskList.done.splice(taskIndex, 1)[0];
    //       this.firebaseDatabaseService.taskList.done.splice(currentIndex, 0, task);
    //     }
    //   }
    //   await this.firebaseDatabaseService.updateTaskList(this.firebaseDatabaseService.taskList);
  }
}
