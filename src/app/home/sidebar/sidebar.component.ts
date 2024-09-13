import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../../services/home/home.service';
import { FirebaseAuthenticationService } from '../../services/firebase-authentication/firebase-authentication.service';
import { AddTaskService } from '../../services/add-task/add-task.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  public homeService: HomeService = inject(HomeService);
  private addTaskService: AddTaskService = inject(AddTaskService);
  public firebaseAuthenticationService: FirebaseAuthenticationService = inject(FirebaseAuthenticationService);
  public router: Router = inject(Router);

  public currentUrl(path: string): string {
    if (this.router.url.includes(`${path}`)) {
      if(path.includes('addTask')) {
        this.addTaskService.status = 'To do'
      }
      return `${path}`;
    } else {
      return '';
    }
  }
}
