import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FirebaseAuthenticationService } from '../services/firebase-authentication/firebase-authentication.service';
import { filter, Subscription } from 'rxjs';
import { HomeService } from '../services/home/home.service';
import { CommonModule } from '@angular/common';
import { FirebaseDatabaseService } from '../services/firebase-database/firebase-database.service';
import { Task } from '../interfaces/task';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  public homeService: HomeService = inject(HomeService);

  private firebaseAuthenticationService: FirebaseAuthenticationService = inject(FirebaseAuthenticationService);
  private firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);
  private router: Router = inject(Router);

  private subscriptions = new Subscription();

  /**
   * Initializes the component.
   * 
   * This method checks if the user is logged in, handles navigation events,
   * and subscribes to the contacts and task list.
   * 
   * @returns {Promise<void>} A promise that resolves when the initialization is complete.
   */
  public async ngOnInit(): Promise<void> {
    await this.firebaseAuthenticationService.checkIfUserIsLogged();
    this.handleNavigationEnd();
    this.subscribeToContacts();
    this.subscribeToTaskList();
  }

  /**
  * Cleans up subscriptions when the component is destroyed.
  */
  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
  * Subscribes to the contacts observable from the Firebase database service.
  * 
  * Updates the local contacts list whenever the observable emits new values.
  */
  private subscribeToContacts(): void {
    const contacts = this.firebaseDatabaseService.contacts$.subscribe(contacts => {
      this.firebaseDatabaseService.contacts = contacts;
    });
    this.subscriptions.add(contacts);
  }

  /**
  * Subscribes to the task list observable from the Firebase database service.
  * 
  * Updates the local task list and concatenates all tasks from different statuses
  * whenever the observable emits new values.
  */
  private subscribeToTaskList(): void {
    const taskList = this.firebaseDatabaseService.taskList$.subscribe(taskList => {
      this.firebaseDatabaseService.taskList = taskList;
      const tasks: Task[] = [];
      this.firebaseDatabaseService.tasks = tasks.concat(taskList.toDo, taskList.inProgress, taskList.awaitFeedback, taskList.done);
    });
    this.subscriptions.add(taskList);
  }

  /**
  * Handles the navigation end event.
  * 
  * Subscribes to router events and scrolls the page to the top when navigation ends.
  */
  private handleNavigationEnd(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.scrollToTop();
    });
  }

  /**
  * Scrolls the specified container to the top.
  * 
  * This method is typically called after navigation to ensure that
  * the user starts at the top of the new content.
  */
  private scrollToTop(): void {
    const container = this.scrollContainer.nativeElement;
    if (container) {
      container.scrollTo({ top: 0, behavior: 'auto' });
    }
  }
}
