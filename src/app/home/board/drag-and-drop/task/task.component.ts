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

  public getCheckedSubtasksCount(): number {
    let countCheckedSubtasks = 0;
    this.firebaseDatabaseService.tasks().forEach(task => {
      if (task.id === this.task.id) {
        task.subtasks.forEach(subtask => {
          if (subtask.checked) {
            countCheckedSubtasks++;
          }
        });
      }
    });
    return countCheckedSubtasks;
  }

  public showSelectedTask(task: Task): void {
    this.boardService.toggleshowBigCardTask();
    this.boardService.getSelectedTask(task);
  }
}
