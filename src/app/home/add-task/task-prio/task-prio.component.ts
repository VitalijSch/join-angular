import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AddTaskService } from '../../../services/add-task/add-task.service';
import { BoardService } from '../../../services/board/board.service';

@Component({
  selector: 'app-task-prio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-prio.component.html',
  styleUrl: './task-prio.component.scss'
})
export class TaskPrioComponent {
  public addTaskService: AddTaskService = inject(AddTaskService);
  private boardService: BoardService = inject(BoardService);

  public ngOnInit(): void {
    this.addTaskService.resetPrio();
    const task = this.boardService.selectedTask;
    if (task) {
      this.selectedPrio(task.prio);
    } else {
      this.selectedPrio('Medium');
    }
  }

  public selectedPrio(prio: string): void {
    if (prio === 'Urgent') {
      this.toggleUrgent();
    }
    if (prio === 'Medium') {
      this.toggleMedium();
    }
    if (prio === 'Low') {
      this.toggleLow();
    }
  }

  public toggleUrgent(): void {
    this.addTaskService.selectUrgent = !this.addTaskService.selectUrgent;
    if (this.addTaskService.selectUrgent) {
      this.addTaskService.task.prio = 'Urgent';
      this.addTaskService.selectMedium = false;
      this.addTaskService.selectLow = false;
    }
  }

  public toggleMedium(): void {
    this.addTaskService.selectMedium = !this.addTaskService.selectMedium;
    if (this.addTaskService.selectMedium) {
      this.addTaskService.task.prio = 'Medium';
      this.addTaskService.selectUrgent = false;
      this.addTaskService.selectLow = false;
    }
  }

  public toggleLow(): void {
    this.addTaskService.selectLow = !this.addTaskService.selectLow;
    if (this.addTaskService.selectLow) {
      this.addTaskService.task.prio = 'Low';
      this.addTaskService.selectMedium = false;
      this.addTaskService.selectUrgent = false;
    }
  }
}
