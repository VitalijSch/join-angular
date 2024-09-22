import { Component, effect, ElementRef, inject, ViewChild } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FirebaseAuthenticationService } from '../services/firebase-authentication/firebase-authentication.service';
import { filter } from 'rxjs';
import { HomeService } from '../services/home/home.service';
import { CommonModule } from '@angular/common';
import { FirebaseDatabaseService } from '../services/firebase-database/firebase-database.service';
import { BoardService } from '../services/board/board.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,HeaderComponent, SidebarComponent, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  private firebaseAuthenticationService: FirebaseAuthenticationService = inject(FirebaseAuthenticationService);
  private firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);
  private boardService: BoardService = inject(BoardService);
  private router: Router = inject(Router);
  public homeService: HomeService = inject(HomeService);

  constructor() {
    effect(() => {
      const tasks = this.firebaseDatabaseService.tasks();
      if (tasks.length > 0) {
        this.boardService.sortTasks(tasks);
        this.firebaseDatabaseService.sortTasks(tasks);
        this.boardService.updateSearchTask(true);
      }
    }, { allowSignalWrites: true });
  }

  public async ngOnInit(): Promise<void> {
    await this.firebaseAuthenticationService.checkIfUserIsLogged();
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
