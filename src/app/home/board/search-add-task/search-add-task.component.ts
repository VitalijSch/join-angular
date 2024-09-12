import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { BoardService } from '../../../services/board/board.service';
import { FirebaseDatabaseService } from '../../../services/firebase-database/firebase-database.service';

@Component({
  selector: 'app-search-add-task',
  standalone: true,
  imports: [],
  templateUrl: './search-add-task.component.html',
  styleUrl: './search-add-task.component.scss'
})
export class SearchAddTaskComponent {
  @ViewChild('search') search!: ElementRef;

  public boardService: BoardService = inject(BoardService);
  private firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);

  public focusInput(): void {
    this.search.nativeElement.focus();
  }

  public searchTask(content: string): void {
    this.boardService.sortTasks(this.firebaseDatabaseService.tasks());
    const filteredToDo = this.boardService.toDo().filter(task => task.title.startsWith(content) || task.description.startsWith(content));
    this.boardService.toDo.set(filteredToDo);
    const filteredInProgress = this.boardService.inProgress().filter(task => task.title.startsWith(content) || task.description.startsWith(content));
    this.boardService.inProgress.set(filteredInProgress);
    const filteredAwaitFeedback = this.boardService.awaitFeedback().filter(task => task.title.startsWith(content) || task.description.startsWith(content));
    this.boardService.awaitFeedback.set(filteredAwaitFeedback);
    const filteredDone = this.boardService.done().filter(task => task.title.startsWith(content) || task.description.startsWith(content));
    this.boardService.done.set(filteredDone);
  }
}
