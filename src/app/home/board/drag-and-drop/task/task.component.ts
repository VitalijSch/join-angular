import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Task } from '../../../../interfaces/task';
import { BoardService } from '../../../../services/board/board.service';

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

  public countCheckedSubtasks: number = 0;

  public ngOnInit(): void {
    this.getCheckedSubtasksCount();
  }

  public getCheckedSubtasksCount(): void {
    this.task.subtasks.forEach(task => {
      if (task.checked) {
        this.countCheckedSubtasks++;
      }
    });
  }

  public showSelectedTask(task: Task): void {
    this.boardService.toggleShowEditTask();
    this.boardService.getSelectedTask(task);
  }
}
