import { Component, effect, inject } from '@angular/core';
import { FirebaseDatabaseService } from '../../../services/firebase-database/firebase-database.service';
import { TaskComponent } from './task/task.component';
import { BoardService } from '../../../services/board/board.service';

@Component({
  selector: 'app-drag-and-drop',
  standalone: true,
  imports: [TaskComponent],
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropComponent {
  public firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);
  public boardService: BoardService = inject(BoardService);

  constructor() {
    effect(() => {
      const tasks = this.firebaseDatabaseService.tasks();
      if (tasks.length > 0) {
        this.boardService.sortTasks(tasks);
      }
    }, { allowSignalWrites: true });
  }
}
