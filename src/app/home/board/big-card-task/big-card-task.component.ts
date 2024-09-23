import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BoardService } from '../../../services/board/board.service';
import { FirebaseDatabaseService } from '../../../services/firebase-database/firebase-database.service';
import { EditTaskComponent } from "./edit-task/edit-task.component";

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

  public async checkedSubtask(taskId: string, index: number): Promise<void> {
    for (const task of this.firebaseDatabaseService.tasks) {
      if (task.id === taskId) {
        task.subtasks[index].checked = !task.subtasks[index].checked;
        this.boardService.selectedTask.set(task);
        await this.firebaseDatabaseService.updateTask(task);
      }
    }
  }

  public async deleteTask(id: string): Promise<void> {
    this.boardService.toggleShowBigCardTask();
    await this.firebaseDatabaseService.deleteTask(id);
  }

  public formattedDate(): string {
    const formattedDate = this.boardService.selectedTask()?.dueDate;
    if (formattedDate) {
      return formattedDate.split('-').reverse().join('/');
    } else {
      return '';
    }
  }
}
