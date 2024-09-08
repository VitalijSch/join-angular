import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AddTaskService } from '../../../services/add-task/add-task.service';

@Component({
  selector: 'app-task-prio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-prio.component.html',
  styleUrl: './task-prio.component.scss'
})
export class TaskPrioComponent {
  public addTaskService: AddTaskService = inject(AddTaskService);

  public selectedPrio(prio: string): void {
    if (prio === 'urgent') {
      this.toggleUrgent();
    }
    if (prio === 'medium') {
      this.toggleMedium();
    }
    if (prio === 'low') {
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
