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

  public async ngOnInit(): Promise<void> {
    await this.firebaseAuthenticationService.checkIfUserIsLogged();
    this.handleNavigationEnd();
    this.subscribeToContacts();
    this.subscribeToTaskList();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private subscribeToContacts(): void {
    const contacts = this.firebaseDatabaseService.contacts$.subscribe(contacts => {
      this.firebaseDatabaseService.contacts = contacts;
    });
    this.subscriptions.add(contacts);
  }

  private subscribeToTaskList(): void {
    const taskList = this.firebaseDatabaseService.taskList$.subscribe(taskList => {
      this.firebaseDatabaseService.taskList = taskList;
      const tasks: Task[] = [];
      this.firebaseDatabaseService.tasks = tasks.concat(taskList.toDo, taskList.inProgress, taskList.awaitFeedback, taskList.done);
    });
    this.subscriptions.add(taskList);
  }

  private handleNavigationEnd(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.scrollToTop();
    });
  }

  private scrollToTop(): void {
    const container = this.scrollContainer.nativeElement;
    if (container) {
      container.scrollTo({ top: 0, behavior: 'auto' });
    }
  }
}
