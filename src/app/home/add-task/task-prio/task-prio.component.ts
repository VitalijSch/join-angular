import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-task-prio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-prio.component.html',
  styleUrl: './task-prio.component.scss'
})
export class TaskPrioComponent {

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
      this.selectMedium = false;
      this.selectLow = false;
    }
  }

  public toggleMedium(): void {
    this.selectMedium = !this.selectMedium;
    if (this.selectMedium) {
      this.selectUrgent = false;
      this.selectLow = false;
    }
  }

  public toggleLow(): void {
    this.selectLow = !this.selectLow;
    if (this.selectLow) {
      this.selectMedium = false;
      this.selectUrgent = false;
    }
  }
}
