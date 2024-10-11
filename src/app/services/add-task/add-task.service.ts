import { Injectable } from '@angular/core';
import { Contact } from '../../interfaces/contact';
import { Task } from '../../interfaces/task';

@Injectable({
  providedIn: 'root'
})
export class AddTaskService {
  public isTitleInvalid: boolean = false;
  public isDueDateInvalid: boolean = false;
  public isCategoryInvalid: boolean = false;

  public selectUrgent: boolean = false;
  public selectMedium: boolean = true;
  public selectLow: boolean = false;

  public showContacts: boolean = false;
  public showCategory: boolean = false;

  public status!: string;

  public task: Task = {
    category: 'Select task category',
    title: '',
    description: '',
    dueDate: '',
    prio: 'Medium',
    assignedTo: [],
    subtasks: [],
    status: ''
  };

  public searchedContact: Contact[] = [];

  /**
 * Toggles the visibility of the category selection.
 * Flips the `showCategory` boolean value to show or hide the category.
 */
  public toggleShowCategory(): void {
    this.showCategory = !this.showCategory;
  }

  /**
 * Resets the task object to its default state.
 * Initializes the task with default values such as 'Select task category' for the category and empty strings for other fields.
 */
  public resetTask(): void {
    this.task = {
      category: 'Select task category',
      title: '',
      description: '',
      dueDate: '',
      prio: 'Medium',
      assignedTo: [],
      subtasks: [],
      status: ''
    };
  }

  /**
 * Resets the priority selection to default.
 * Sets the `selectUrgent`, `selectMedium`, and `selectLow` flags to false, clearing any previous priority selection.
 */
  public resetPrio(): void {
    this.selectUrgent = false;
    this.selectMedium = false;
    this.selectLow = false;
  }
}
