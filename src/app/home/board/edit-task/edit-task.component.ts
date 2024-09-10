import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BoardService } from '../../../services/board/board.service';
import { FirebaseDatabaseService } from '../../../services/firebase-database/firebase-database.service';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.scss'
})
export class EditTaskComponent {
  public boardService: BoardService = inject(BoardService);
  private firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);

  public async deleteTask(id: string): Promise<void> {
    this.boardService.toggleShowEditTask();
    await this.firebaseDatabaseService.deleteTask(id);
  }
}
