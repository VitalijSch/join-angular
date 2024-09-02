import { Component, inject, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AddTaskService } from '../../../services/add-task/add-task.service';
import { FirebaseDatabaseService } from '../../../services/firebase-database/firebase-database.service';
import { CommonModule } from '@angular/common';
import { FirebaseAuthenticationService } from '../../../services/firebase-authentication/firebase-authentication.service';

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
    this.addTaskService.contacts = this.firebaseDatabaseService.contacts();
  }

  public searchContacts(): void {
    const searchValue = this.taskForm.get('searchContact')?.value;
    if (searchValue !== '') {
      this.addTaskService.contacts = [];
      this.firebaseDatabaseService.contacts().forEach(contact => {
        if (contact.name.toLowerCase().includes(searchValue.toLowerCase())) {
          this.addTaskService.contacts.push(contact);
        }
      });
    } else {
      this.addTaskService.contacts = this.firebaseDatabaseService.contacts();
    }
  }

  public toggleSelectedContact(index: number): void {
    let contactSelected = this.firebaseDatabaseService.contacts()[index].selected;
    this.firebaseDatabaseService.contacts()[index].selected = !contactSelected;
  }

  public deleteSelectedContact(index: number): void {
    this.addTaskService.contacts[index].selected = false;
  }
}
