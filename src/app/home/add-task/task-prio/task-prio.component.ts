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
  private addTaskService: AddTaskService = inject(AddTaskService);

  public selectUrgent: boolean = false;
  public selectMedium: boolean = true;
  public selectLow: boolean = false;

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
    this.selectUrgent = !this.selectUrgent;
    if (this.selectUrgent) {
      this.addTaskService.tasks.prio = 'Urgent';
      this.selectMedium = false;
      this.selectLow = false;
    }
  }

  public toggleMedium(): void {
    this.selectMedium = !this.selectMedium;
    if (this.selectMedium) {
      this.addTaskService.tasks.prio = 'Medium';
      this.selectUrgent = false;
      this.selectLow = false;
    }
  }

  public toggleLow(): void {
    this.selectLow = !this.selectLow;
    if (this.selectLow) {
      this.addTaskService.tasks.prio = 'Low';
      this.selectMedium = false;
      this.selectUrgent = false;
    }
  }
}
