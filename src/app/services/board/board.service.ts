import { Injectable, signal, WritableSignal } from '@angular/core';
import { Task } from '../../interfaces/task';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  public showBigCardTask: boolean = false;
  public showAddTask: boolean = false;
  public showEditTask: boolean = false;

  public selectedTask: WritableSignal<Task | null> = signal<Task | null>(null);

  public toDo: WritableSignal<Task[]> = signal<Task[]>([]);
  public inProgress: WritableSignal<Task[]> = signal<Task[]>([]);
  public awaitFeedback: WritableSignal<Task[]> = signal<Task[]>([]);
  public done: WritableSignal<Task[]> = signal<Task[]>([]);

  private searchTaskSource = new BehaviorSubject<boolean>(false);
  public searchedTask = this.searchTaskSource.asObservable();

  public updateSearchTask(status: boolean) {
    this.searchTaskSource.next(status);
  }

  public toggleShowBigCardTask(): void {
    this.showBigCardTask = !this.showBigCardTask;
    this.showEditTask = false;
    if (!this.showBigCardTask) {
      this.selectedTask.set(null);
    }
  }

  public toggleShowAddTask(): void {
    this.showAddTask = !this.showAddTask;
  }

  public toggleShowEditTask(): void {
    this.showEditTask = !this.showEditTask;
  }

  public sortTasks(tasks: Task[]): void {
    this.toDo.set(tasks.filter(task => task.status === 'To do'));
    this.inProgress.set(tasks.filter(task => task.status === 'In progress'));
    this.awaitFeedback.set(tasks.filter(task => task.status === 'Await feedback'));
    this.done.set(tasks.filter(task => task.status !== 'To do' && task.status !== 'In progress' && task.status !== 'Await feedback'));
  }
}
