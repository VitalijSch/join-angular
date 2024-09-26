import { Component, inject } from '@angular/core';
import { BoardService } from '../../../services/board/board.service';
import { AddTaskService } from '../../../services/add-task/add-task.service';

@Component({
  selector: 'app-drag-and-drop-header',
  standalone: true,
  imports: [],
  templateUrl: './drag-and-drop-header.component.html',
  styleUrl: './drag-and-drop-header.component.scss'
})
export class DragAndDropHeaderComponent {
  public boardService: BoardService = inject(BoardService);
  
  private addTaskService: AddTaskService = inject(AddTaskService);

  public showAddTaskWithRightStatus(status: string): void {
    this.addTaskService.status = status;
    this.boardService.toggleShowAddTask();
  }
}
