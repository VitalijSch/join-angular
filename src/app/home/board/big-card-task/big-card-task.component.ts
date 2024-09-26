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

  public async deleteTask(t: Task): Promise<void> {
    this.boardService.toggleShowBigCardTask();
    this.spliceTaskFromTaskList(t);
    await this.firebaseDatabaseService.updateTaskList(this.firebaseDatabaseService.taskList);
  }

  public formattedDate(): string {
    const formattedDate = this.boardService.selectedTask?.dueDate;
    if (formattedDate) {
      return formattedDate.split('-').reverse().join('/');
    } else {
      return '';
    }
  }

  private spliceTaskFromTaskList(t: Task): void {
    this.lists.forEach(list => {
      const index = list.findIndex(task => task === t);
      if (index !== -1) {
        list.splice(index, 1);
      }
    });
  }

  private updateSelectedTaskInLists(): void {
    this.lists.forEach(list => {
      const taskIndex = list.findIndex(task => task === this.boardService.selectedTask);
      if (taskIndex !== -1 && this.boardService.selectedTask) {
        list[taskIndex] = this.boardService.selectedTask;
      }
    });
  }
}
