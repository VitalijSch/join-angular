import { Injectable } from '@angular/core';
import { Contact } from '../../interfaces/contact';
import { Task } from '../../interfaces/task';

@Injectable({
  providedIn: 'root'
})
export class AddTaskService {
  public task: Task = {
    id: '',
    category: 'Select task category',
    title: '',
    description: '',
    dueDate: '',
    prio: 'Medium',
    assignedTo: [],
    subtasks: []
  };

  public searchedContact: Contact[] = [];

  public showContacts: boolean = false;
  public showCategory: boolean = false;

  public isTitleInvalid: boolean = false;
  public isDueDateInvalid: boolean = false;
  public isCategoryInvalid: boolean = false;

  public toggleShowCategory(): void {
    this.showCategory = !this.showCategory;
  }
}
