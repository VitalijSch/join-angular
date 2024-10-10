import { Component, inject } from '@angular/core';
import { FirebaseAuthenticationService } from '../../services/firebase-authentication/firebase-authentication.service';
import { HomeService } from '../../services/home/home.service';
import { BoardService } from '../../services/board/board.service';
import { FirebaseDatabaseService } from '../../services/firebase-database/firebase-database.service';
import { AddTaskService } from '../../services/add-task/add-task.service';
import { ToDoAndDoneComponent } from './to-do-and-done/to-do-and-done.component';
import { UrgentComponent } from './urgent/urgent.component';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [ToDoAndDoneComponent, UrgentComponent],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
  public firebaseAuthenticationService: FirebaseAuthenticationService = inject(FirebaseAuthenticationService);
  public firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);
  public boardService: BoardService = inject(BoardService);
  public homeService: HomeService = inject(HomeService);

  private addTaskService: AddTaskService = inject(AddTaskService);

  public ngOnInit(): void {
    this.addTaskService.status = '';
  }

  public getGreeting(): string {
    const now = new Date();
    const hours = now.getHours();
    if (hours >= 0 && hours < 12) {
      return 'Good morning';
    } else if (hours >= 12 && hours < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  }
}
