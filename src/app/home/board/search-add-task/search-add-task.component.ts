import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { BoardService } from '../../../services/board/board.service';
import { FirebaseDatabaseService } from '../../../services/firebase-database/firebase-database.service';
import { AddTaskService } from '../../../services/add-task/add-task.service';
import { Subscription } from 'rxjs';

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

  private subscription!: Subscription;

  public ngOnInit(): void {
    this.subscription = this.boardService.searchedTask.subscribe((status: boolean) => {
      if (status && this.search) {
        this.search.nativeElement.value = '';
      }
    });
  }

  public focusInput(): void {
    this.search.nativeElement.focus();
  }

  public async searchTask(content: string): Promise<void> {
    const filteredToDo = this.firebaseDatabaseService.taskList.toDo.filter(task => task.title.toLocaleLowerCase().includes(content.toLocaleLowerCase()) || task.description.startsWith(content));
    this.firebaseDatabaseService.taskList.toDo = filteredToDo;
    const filteredInProgress = this.firebaseDatabaseService.taskList.inProgress.filter(task => task.title.toLocaleLowerCase().includes(content.toLocaleLowerCase()) || task.description.startsWith(content));
    this.firebaseDatabaseService.taskList.inProgress = filteredInProgress;
    const filteredAwaitFeedback = this.firebaseDatabaseService.taskList.awaitFeedback.filter(task => task.title.toLocaleLowerCase().includes(content.toLocaleLowerCase()) || task.description.startsWith(content));
    this.firebaseDatabaseService.taskList.awaitFeedback = filteredAwaitFeedback;
    const filteredDone = this.firebaseDatabaseService.taskList.done.filter(task => task.title.toLocaleLowerCase().includes(content.toLocaleLowerCase()) || task.description.startsWith(content));
    this.firebaseDatabaseService.taskList.done = filteredDone;
  }

  public showAddTaskWithRightStatus(): void {
    this.addTaskService.status = 'To do';
    this.boardService.toggleShowAddTask();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
