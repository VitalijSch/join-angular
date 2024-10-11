import { Component, inject, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AddTaskService } from '../../../services/add-task/add-task.service';
import { FirebaseDatabaseService } from '../../../services/firebase-database/firebase-database.service';
import { CommonModule } from '@angular/common';
import { FirebaseAuthenticationService } from '../../../services/firebase-authentication/firebase-authentication.service';
import { Contact } from '../../../interfaces/contact';
import { BoardService } from '../../../services/board/board.service';

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
  public boardService: BoardService = inject(BoardService);
  public firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);
  public firebaseAuthenticationService: FirebaseAuthenticationService = inject(FirebaseAuthenticationService);

  /**
   * Initializes the component by fetching contacts from the database.
   *
   * @public
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  public async ngOnInit(): Promise<void> {
    await this.firebaseDatabaseService.getContact();
    this.addTaskService.searchedContact = this.firebaseDatabaseService.contacts;
  }

  /**
  * Opens the contacts selection UI.
  *
  * @public
  * @returns {void}
  */
  public openContacts(): void {
    this.addTaskService.showContacts = true;
  }

  /**
  * Closes the contacts selection UI and resets the search input.
  *
  * @public
  * @returns {void}
  */
  public closeContacts(): void {
    this.addTaskService.showContacts = false;
    this.taskForm.get('searchContact')?.reset();
    this.addTaskService.searchedContact = this.firebaseDatabaseService.contacts;
  }

  /**
  * Searches for contacts based on the input value and updates the searched contacts.
  *
  * @public
  * @returns {void}
  */
  public searchContacts(): void {
    const searchValue = this.taskForm.get('searchContact')?.value;
    if (searchValue !== '') {
      this.addTaskService.searchedContact = [];
      this.firebaseDatabaseService.contacts.forEach(contact => {
        if (contact.name.toLowerCase().includes(searchValue.toLowerCase())) {
          this.addTaskService.searchedContact.push(contact);
        }
      });
    } else {
      this.addTaskService.searchedContact = this.firebaseDatabaseService.contacts;
    }
  }

  /**
  * Toggles the selection state of the current contact.
  *
  * @public
  * @param {Contact} currentContact - The contact to toggle the selection for.
  * @returns {void}
  */
  public toggleSelectedContact(currentContact: Contact): void {
    let index = this.firebaseDatabaseService.contacts.findIndex(contact => contact === currentContact);
    let contactSelected = this.firebaseDatabaseService.contacts[index].selected;
    this.firebaseDatabaseService.contacts[index].selected = !contactSelected;
    this.saveContacts();
  }

  /**
  * Deselects a contact from the assigned contacts list.
  *
  * @public
  * @param {number} index - The index of the contact to be deselected.
  * @returns {void}
  */
  public deleteSelectedContact(index: number): void {
    this.addTaskService.task.assignedTo[index].selected = false;
    this.saveContacts();
  }

  /**
  * Saves the currently selected contacts to the task's assigned contacts list.
  *
  * @private
  * @returns {void}
  */
  private saveContacts(): void {
    const activeContacts = this.firebaseDatabaseService.contacts.filter(contact => contact.selected);
    this.addTaskService.task.assignedTo = [];
    this.addTaskService.task.assignedTo = activeContacts;
  }
}
