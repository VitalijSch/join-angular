import { Component, inject } from '@angular/core';
import { SearchAddTaskComponent } from './search-add-task/search-add-task.component';
import { DragAndDropHeaderComponent } from './drag-and-drop-header/drag-and-drop-header.component';
import { DragAndDropComponent } from './drag-and-drop/drag-and-drop.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { BoardService } from '../../services/board/board.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [SearchAddTaskComponent, DragAndDropHeaderComponent, DragAndDropComponent, EditTaskComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  public boardService: BoardService = inject(BoardService);
}
