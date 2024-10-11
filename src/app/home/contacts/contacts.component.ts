import { Component, inject } from '@angular/core';
import { AddNewContactComponent } from './add-new-contact/add-new-contact.component';
import { HomeService } from '../../services/home/home.service';
import { FirebaseDatabaseService } from '../../services/firebase-database/firebase-database.service';
import { CommonModule } from '@angular/common';
import { ContactsDataComponent } from "./contacts-data/contacts-data.component";
import { EditContactComponent } from './edit-contact/edit-contact.component';
import { AddTaskService } from '../../services/add-task/add-task.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [AddNewContactComponent, CommonModule, ContactsDataComponent, EditContactComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {
  public homeService: HomeService = inject(HomeService);
  public firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);

  private addTaskService: AddTaskService = inject(AddTaskService);

  /**
   * Initializes the component by resetting the current contact and clearing the task status.
   *
   * This method is called once the component is initialized. It uses the home service
   * to reset the current contact and sets the status in the add task service to an empty string.
   */
  public ngOnInit(): void {
    this.homeService.resetCurrentContact();
    this.addTaskService.status = '';
  }
}
