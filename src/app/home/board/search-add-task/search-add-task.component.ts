import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { BoardService } from '../../../services/board/board.service';
import { FirebaseDatabaseService } from '../../../services/firebase-database/firebase-database.service';
import { AddTaskService } from '../../../services/add-task/add-task.service';
import { Subscription } from 'rxjs';
import { Task } from '../../../interfaces/task';

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

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public focusInput(): void {
    this.search.nativeElement.focus();
  }

  public showAddTaskWithRightStatus(): void {
    this.addTaskService.status = 'To do';
    this.boardService.toggleShowAddTask();
  }

  public async searchTask(content: string): Promise<void> {
    await this.firebaseDatabaseService.getTaskList();
    this.firebaseDatabaseService.taskList.toDo = this.filterTasks(this.firebaseDatabaseService.taskList.toDo, content);
    this.firebaseDatabaseService.taskList.inProgress = this.filterTasks(this.firebaseDatabaseService.taskList.inProgress, content);
    this.firebaseDatabaseService.taskList.awaitFeedback = this.filterTasks(this.firebaseDatabaseService.taskList.awaitFeedback, content);
    this.firebaseDatabaseService.taskList.done = this.filterTasks(this.firebaseDatabaseService.taskList.done, content);
  }

  private filterTasks(tasks: Task[], content: string): Task[] {
    const lowerCaseContent = content.toLocaleLowerCase();
    return tasks.filter(task =>
      task.title.toLocaleLowerCase().includes(lowerCaseContent) ||
      task.description.startsWith(lowerCaseContent)
    );
  }
}
