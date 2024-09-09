import { Component, inject } from '@angular/core';
import { FirebaseDatabaseService } from '../../../services/firebase-database/firebase-database.service';
import { Task } from '../../../interfaces/task';
import { CommonModule } from '@angular/common';
import { TaskComponent } from './task/task.component';

@Component({
  selector: 'app-drag-and-drop',
  standalone: true,
  imports: [TaskComponent],
  templateUrl: './drag-and-drop.component.html',
  styleUrl: './drag-and-drop.component.scss'
})
export class DragAndDropComponent {
  public firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);

  public toDo: Task[] = [];
  public inProgress: Task[] = [];
  public awaitFeedback: Task[] = [];
  public done: Task[] = [];

  public async ngOnInit(): Promise<void> {
    this.firebaseDatabaseService.getTask();
    this.firebaseDatabaseService.tasks().forEach(task => {
      if (task.status === 'To do') {
        this.toDo.push(task)
      } else if (task.status === 'In progress') {
        this.inProgress.push(task);
      } else if (task.status === 'Await feedback') {
        this.awaitFeedback.push(task);
      } else {
        this.done.push(task);
      }
    });
  }


}
