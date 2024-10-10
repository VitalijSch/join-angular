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

  public ngOnInit(): void {
    this.homeService.resetCurrentContact();
    this.addTaskService.status = '';
  }
}
