import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { BoardService } from '../../../services/board/board.service';
import { FirebaseDatabaseService } from '../../../services/firebase-database/firebase-database.service';
import { AddTaskService } from '../../../services/add-task/add-task.service';
import { Subscription } from 'rxjs';
import { Task } from '../../../interfaces/task';
import { HomeService } from '../../../services/home/home.service';

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
  private homeService: HomeService = inject(HomeService);

  private subscription!: Subscription;

  /**
   * Initializes the component and subscribes to the searchedTask observable.
   * 
   * This method is called once the component is initialized. It listens for 
   * changes to the searchedTask observable in the boardService. If a search 
   * is triggered and there is an active search input, it clears the input field.
   *
   * @public
   */
  public ngOnInit(): void {
    this.subscription = this.boardService.searchedTask.subscribe((status: boolean) => {
      if (status && this.search) {
        this.search.nativeElement.value = '';
      }
    });
  }

  /**
  * Cleans up the component before it is destroyed.
  *
  * This method is called just before the component is removed from the DOM. 
  * It unsubscribes from the searchedTask observable to prevent memory leaks.
  *
  * @public
  */
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
  * Sets focus on the search input element.
  *
  * This method is called to programmatically focus the search input, 
  * allowing the user to quickly start typing a search query.
  *
  * @public
  */
  public focusInput(): void {
    this.search.nativeElement.focus();
  }

  /**
  * Shows the add task interface based on the current screen width.
  *
  * This method checks the screen width and sets the status of the addTaskService
  * to 'To do'. If the screen width is less than or equal to 1080 pixels, it 
  * navigates to the add task route; otherwise, it toggles the visibility of the 
  * add task interface on the board.
  *
  * @public
  */
  public showAddTaskWithRightStatus(): void {
    const screenWidth = window.innerWidth;
    this.addTaskService.status = 'To do';
    if (screenWidth <= 1080) {
      this.homeService.navigateToRoute('addTask');
    } else {
      this.boardService.toggleShowAddTask();
    }
  }

  /**
  * Searches for tasks based on the provided content string.
  *
  * This asynchronous method retrieves the current task list and filters 
  * tasks in each category (to do, in progress, await feedback, done) 
  * based on the provided content. The filtered results are updated in 
  * the firebaseDatabaseService.
  *
  * @param {string} content - The search string used to filter tasks.
  * @returns {Promise<void>} - A promise that resolves when the search is complete.
  * @public
  */
  public async searchTask(content: string): Promise<void> {
    await this.firebaseDatabaseService.getTaskList();
    this.firebaseDatabaseService.taskList.toDo = this.filterTasks(this.firebaseDatabaseService.taskList.toDo, content);
    this.firebaseDatabaseService.taskList.inProgress = this.filterTasks(this.firebaseDatabaseService.taskList.inProgress, content);
    this.firebaseDatabaseService.taskList.awaitFeedback = this.filterTasks(this.firebaseDatabaseService.taskList.awaitFeedback, content);
    this.firebaseDatabaseService.taskList.done = this.filterTasks(this.firebaseDatabaseService.taskList.done, content);
  }

  /**
  * Filters tasks based on the provided content string.
  *
  * This private method filters the tasks array to return only those tasks 
  * whose title or description starts with the specified content. 
  * The content is converted to lower case for case-insensitive matching.
  *
  * @param {Task[]} tasks - The array of tasks to be filtered.
  * @param {string} content - The content string to filter the tasks by.
  * @returns {Task[]} - An array of tasks that match the filter criteria.
  * @private
  */
  private filterTasks(tasks: Task[], content: string): Task[] {
    const lowerCaseContent = content.toLocaleLowerCase();
    return tasks.filter(task =>
      task.title.toLocaleLowerCase().includes(lowerCaseContent) ||
      task.description.startsWith(lowerCaseContent)
    );
  }
}
