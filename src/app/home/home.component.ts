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
   * Initializes the component by checking if the user is logged in and setting up necessary subscriptions and handlers.
   * This method is called once the component is initialized.
   * 
   * @async
   * @returns {Promise<void>} Resolves when all initialization tasks are complete.
   * 
   * @description
   *  - Checks if the user is logged in using the Firebase Authentication service.
   *  - Handles navigation events at the end of the routing process.
   *  - Subscribes to contact updates and task list updates.
   *  - Initiates the greeting animation for the user.
   */
  public async ngOnInit(): Promise<void> {
    await this.firebaseAuthenticationService.checkIfUserIsLogged();
    this.handleNavigationEnd();
    this.subscribeToContacts();
    this.subscribeToTaskList();
    this.handleGreetingAnimation();
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

  /**
 * Triggers and controls the greeting animation by toggling the `showSummaryAnimation` property.
 * 
 * @private
 * @returns {void}
 * 
 * @description
 *  - Sets `showSummaryAnimation` to `true` to start the animation.
 *  - After a 2-second delay, resets `showSummaryAnimation` to `false` to end the animation.
 */
  private handleGreetingAnimation(): void {
    this.homeService.showSummaryAnimation = true;
    setTimeout(() => {
      this.homeService.showSummaryAnimation = false;
    }, 2000);
  }
}
