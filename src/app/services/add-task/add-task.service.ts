import { Injectable } from '@angular/core';
import { Contact } from '../../interfaces/contact';

@Injectable({
  providedIn: 'root'
})
export class AddTaskService {
  public contacts: Contact[] = [];

  public showContacts: boolean = false;
  public showCategory: boolean = false;

  public toggleShowCategory(): void {
    this.showCategory = !this.showCategory;
  }
}
