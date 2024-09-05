import { Injectable } from '@angular/core';
import { Contact } from '../../interfaces/contact';
import { Board } from '../../interfaces/board';

@Injectable({
  providedIn: 'root'
})
export class AddTaskService {
  public tasks: Board = {
    category: 'Select task category',
    title: '',
    description: '',
    dueDate: '',
    prio: 'Medium',
    assignedTo: [],
    subtasks: []
  };

  public showContacts: boolean = false;
  public showCategory: boolean = false;

  public toggleShowCategory(): void {
    this.showCategory = !this.showCategory;
    this.tasks.title;
  }
}
