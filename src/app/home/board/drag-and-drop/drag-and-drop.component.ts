import { Component, inject } from '@angular/core';
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

  public async onDrop(event: CdkDragDrop<Task>): Promise<void> {
    const draggedTask = event.item.data;
    const currentContainerId = event.container.id;
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
    await this.firebaseDatabaseService.updateTask(this.firebaseDatabaseService.tasks()[index]);
  }
}
