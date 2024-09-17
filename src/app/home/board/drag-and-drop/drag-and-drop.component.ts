import { Component, effect, inject } from '@angular/core';
import { FirebaseDatabaseService } from '../../../services/firebase-database/firebase-database.service';
import { TaskComponent } from './task/task.component';
import { BoardService } from '../../../services/board/board.service';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Task } from '../../../interfaces/task';

@Component({
  selector: 'app-drag-and-drop',
  standalone: true,
  imports: [TaskComponent, DragDropModule],
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

  public onDrop(event: CdkDragDrop<Task>): void {
    const draggedTask = event.item.data;
    const previousContainerId = event.previousContainer.id;
    const currentContainerId = event.container.id;
  
    console.log('Dragged Task:', draggedTask);
    console.log('Previous Container ID:', previousContainerId);
    console.log('Current Container ID:', currentContainerId);
  
    // Überprüfe anhand der expliziten IDs den aktuellen Container und aktualisiere den Status des Tasks
    const index = this.firebaseDatabaseService.tasks().findIndex(task => task.id === draggedTask.id);
    if (index !== -1) {
      if (currentContainerId === 'toDoList') {
        this.firebaseDatabaseService.tasks()[index].status = 'To do';
      } else if (currentContainerId === 'inProgressList') {
        this.firebaseDatabaseService.tasks()[index].status = 'In progress';
      } else if (currentContainerId === 'awaitFeedbackList') {
        this.firebaseDatabaseService.tasks()[index].status = 'Await feedback';
      } else if (currentContainerId === 'doneList') {
        this.firebaseDatabaseService.tasks()[index].status = 'Done';
      }
    }
  
    console.log(this.firebaseDatabaseService.tasks());
    this.boardService.sortTasks(this.firebaseDatabaseService.tasks());
    console.log(this.boardService.toDo());
    console.log(this.boardService.inProgress());
    console.log(this.boardService.awaitFeedback());
    console.log(this.boardService.done());
  }
}
