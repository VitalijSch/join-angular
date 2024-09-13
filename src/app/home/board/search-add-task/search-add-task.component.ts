import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { BoardService } from '../../../services/board/board.service';
import { FirebaseDatabaseService } from '../../../services/firebase-database/firebase-database.service';
import { AddTaskService } from '../../../services/add-task/add-task.service';

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
  private addTaskService: AddTaskService = inject(AddTaskService);
  private firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);

  public focusInput(): void {
    this.search.nativeElement.focus();
  }

  public searchTask(content: string): void {
    this.boardService.sortTasks(this.firebaseDatabaseService.tasks());
    const filteredToDo = this.boardService.toDo().filter(task => task.title.toLocaleLowerCase().includes(content.toLocaleLowerCase()) || task.description.startsWith(content));
    this.boardService.toDo.set(filteredToDo);
    const filteredInProgress = this.boardService.inProgress().filter(task => task.title.toLocaleLowerCase().includes(content.toLocaleLowerCase()) || task.description.startsWith(content));
    this.boardService.inProgress.set(filteredInProgress);
    const filteredAwaitFeedback = this.boardService.awaitFeedback().filter(task => task.title.toLocaleLowerCase().includes(content.toLocaleLowerCase()) || task.description.startsWith(content));
    this.boardService.awaitFeedback.set(filteredAwaitFeedback);
    const filteredDone = this.boardService.done().filter(task => task.title.toLocaleLowerCase().includes(content.toLocaleLowerCase()) || task.description.startsWith(content));
    this.boardService.done.set(filteredDone);
  }

  public showAddTaskWithRightStatus(): void {
    this.addTaskService.status = 'To do';
    this.boardService.toggleShowAddTask();
  }
}
