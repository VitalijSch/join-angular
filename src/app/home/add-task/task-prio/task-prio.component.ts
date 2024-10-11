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

  /**
   * Initializes the component by resetting the priority and setting the selected priority
   * based on the currently selected task from the board service. If no task is selected,
   * it defaults to 'Medium' priority.
   *
   * @public
   * @returns {void}
   */
  public ngOnInit(): void {
    this.addTaskService.resetPrio();
    const task = this.boardService.selectedTask;
    if (task) {
      this.selectedPrio(task.prio);
    } else {
      this.selectedPrio('Medium');
    }
  }

  /**
  * Sets the selected priority based on the provided priority string.
  * It toggles the urgency of the task if the provided priority is 'Urgent',
  * or sets the medium or low priority accordingly.
  *
  * @public
  * @param {string} prio - The priority to be selected ('Urgent', 'Medium', or 'Low').
  * @returns {void}
  */
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

  /**
  * Toggles the urgent priority selection for the task.
  * If selected, it sets the task priority to 'Urgent' and deselects medium and low priorities.
  *
  * @public
  * @returns {void}
  */
  public toggleUrgent(): void {
    this.addTaskService.selectUrgent = !this.addTaskService.selectUrgent;
    if (this.addTaskService.selectUrgent) {
      this.addTaskService.task.prio = 'Urgent';
      this.addTaskService.selectMedium = false;
      this.addTaskService.selectLow = false;
    }
  }

  /**
  * Toggles the medium priority selection for the task.
  * If selected, it sets the task priority to 'Medium' and deselects urgent and low priorities.
  *
  * @public
  * @returns {void}
  */
  public toggleMedium(): void {
    this.addTaskService.selectMedium = !this.addTaskService.selectMedium;
    if (this.addTaskService.selectMedium) {
      this.addTaskService.task.prio = 'Medium';
      this.addTaskService.selectUrgent = false;
      this.addTaskService.selectLow = false;
    }
  }

  /**
  * Toggles the low priority selection for the task.
  * If selected, it sets the task priority to 'Low' and deselects urgent and medium priorities.
  *
  * @public
  * @returns {void}
  */
  public toggleLow(): void {
    this.addTaskService.selectLow = !this.addTaskService.selectLow;
    if (this.addTaskService.selectLow) {
      this.addTaskService.task.prio = 'Low';
      this.addTaskService.selectMedium = false;
      this.addTaskService.selectUrgent = false;
    }
  }
}
