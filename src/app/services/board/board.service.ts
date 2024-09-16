import { Injectable, signal, WritableSignal } from '@angular/core';
import { Task } from '../../interfaces/task';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  public showBigCardTask: boolean = false;
  public showAddTask: boolean = false;
  public showEditTask: boolean = false;

  public selectedTask: Task | null = null;

  public toDo: WritableSignal<Task[]> = signal<Task[]>([]);
  public inProgress: WritableSignal<Task[]> = signal<Task[]>([]);
  public awaitFeedback: WritableSignal<Task[]> = signal<Task[]>([]);
  public done: WritableSignal<Task[]> = signal<Task[]>([]);

  public toggleShowBigCardTask(): void {
    this.showBigCardTask = !this.showBigCardTask;
    this.showEditTask = false;
    if (!this.showBigCardTask) {
      this.selectedTask = null;
    }
  }

  public toggleShowAddTask(): void {
    this.showAddTask = !this.showAddTask;
  }

  public toggleShowEditTask(): void {
    this.showEditTask = !this.showEditTask;
  }

  public getSelectedTask(task: Task): void {
    this.selectedTask = task;
  }

  public sortTasks(tasks: Task[]): void {
    this.toDo.set(tasks.filter(task => task.status === 'To do'));
    this.inProgress.set(tasks.filter(task => task.status === 'In progress'));
    this.awaitFeedback.set(tasks.filter(task => task.status === 'Await feedback'));
    this.done.set(tasks.filter(task => task.status !== 'To do' && task.status !== 'In progress' && task.status !== 'Await feedback'));
  }
}
