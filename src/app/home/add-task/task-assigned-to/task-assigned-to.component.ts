import { Component, inject, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AddTaskService } from '../../../services/add-task/add-task.service';
import { FirebaseDatabaseService } from '../../../services/firebase-database/firebase-database.service';
import { CommonModule } from '@angular/common';
import { FirebaseAuthenticationService } from '../../../services/firebase-authentication/firebase-authentication.service';
import { Contact } from '../../../interfaces/contact';

@Component({
  selector: 'app-task-assigned-to',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-assigned-to.component.html',
  styleUrl: './task-assigned-to.component.scss'
})
export class TaskAssignedToComponent {
  @Input() taskForm!: FormGroup;

  public addTaskService: AddTaskService = inject(AddTaskService);
  public firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);
  public firebaseAuthenticationService: FirebaseAuthenticationService = inject(FirebaseAuthenticationService);

  public openContacts(): void {
    this.addTaskService.showContacts = true;
  }

  public closeContacts(): void {
    this.addTaskService.showContacts = false;
    this.taskForm.get('searchContact')?.reset();
    this.addTaskService.tasks.assignedTo = this.firebaseDatabaseService.contacts();
  }

  public searchContacts(): void {
    const searchValue = this.taskForm.get('searchContact')?.value;
    if (searchValue !== '') {
      this.addTaskService.tasks.assignedTo = [];
      this.firebaseDatabaseService.contacts().forEach(contact => {
        if (contact.name.toLowerCase().includes(searchValue.toLowerCase())) {
          this.addTaskService.tasks.assignedTo.push(contact);
        }
      });
    } else {
      this.addTaskService.tasks.assignedTo = this.firebaseDatabaseService.contacts();
    }
  }

  public toggleSelectedContact(currentContact: Contact): void {
    let index = this.firebaseDatabaseService.contacts().findIndex(contact => contact === currentContact);
    let contactSelected = this.firebaseDatabaseService.contacts()[index].selected;
    this.firebaseDatabaseService.contacts()[index].selected = !contactSelected;
    this.saveContactss();
  }

  public deleteSelectedContact(index: number): void {
    this.addTaskService.tasks.assignedTo[index].selected = false;
    this.saveContactss();
  }

  private saveContactss(): void {
    const activeContacts = this.firebaseDatabaseService.contacts().filter(contact => contact.selected);
    this.addTaskService.tasks.assignedTo = [];
    this.addTaskService.tasks.assignedTo = activeContacts;
  }
}
