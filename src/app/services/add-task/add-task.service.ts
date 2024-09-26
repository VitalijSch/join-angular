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

  public toggleShowCategory(): void {
    this.showCategory = !this.showCategory;
  }

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

  public resetPrio(): void {
    this.selectUrgent = false;
    this.selectMedium = false;
    this.selectLow = false;
  }
}
