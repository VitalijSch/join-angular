import { Component, inject } from '@angular/core';
import { SearchAddTaskComponent } from './search-add-task/search-add-task.component';
import { DragAndDropComponent } from './drag-and-drop/drag-and-drop.component';
import { BoardService } from '../../services/board/board.service';
import { AddTaskComponent } from '../add-task/add-task.component';
import { BigCardTaskComponent } from "./big-card-task/big-card-task.component";
import { AddTaskService } from '../../services/add-task/add-task.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [SearchAddTaskComponent, DragAndDropComponent, AddTaskComponent, BigCardTaskComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  public boardService: BoardService = inject(BoardService);

  private addTaskService: AddTaskService = inject(AddTaskService);

  /**
   * Initializes the component and sets the status of the add task service.
   *
   * This method is called once the component is initialized. It sets the
   * status property of the `addTaskService` to an empty string, preparing
   * the service for further use in task management.
   *
   * @public
   */
  public ngOnInit(): void {
    this.addTaskService.status = '';
  }
}
