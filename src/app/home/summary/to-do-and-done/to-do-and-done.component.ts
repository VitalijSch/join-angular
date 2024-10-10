import { Component, inject, Input } from '@angular/core';
import { FirebaseDatabaseService } from '../../../services/firebase-database/firebase-database.service';
import { HomeService } from '../../../services/home/home.service';

@Component({
  selector: 'app-to-do-and-done',
  standalone: true,
  imports: [],
  templateUrl: './to-do-and-done.component.html',
  styleUrl: './to-do-and-done.component.scss'
})
export class ToDoAndDoneComponent {
  @Input() taskStatus!: string;

  public firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);
  public homeService: HomeService = inject(HomeService);

  public getTaskStatus(): string {
    if (this.taskStatus === 'To-do') {
      return 'To-do';
    } else {
      return 'Done';
    }
  }

  public getTaskStatusLength(): number {
    if (this.taskStatus === 'To-do') {
      return this.firebaseDatabaseService.taskList.toDo.length;
    } else {
      return this.firebaseDatabaseService.taskList.done.length;
    }
  }
}
