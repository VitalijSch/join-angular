import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HomeService } from '../../services/home/home.service';
import { FirebaseAuthenticationService } from '../../services/firebase-authentication/firebase-authentication.service';
import { FirebaseDatabaseService } from '../../services/firebase-database/firebase-database.service';
import { Contact } from '../../interfaces/contact';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  public homeService: HomeService = inject(HomeService);
  public firebaseAuthenticationService: FirebaseAuthenticationService = inject(FirebaseAuthenticationService);
  public firebaseDatabaseService: FirebaseDatabaseService = inject(FirebaseDatabaseService);
  private fb: FormBuilder = inject(FormBuilder);

  public contacts: Contact[] = [];

  public taskForm!: FormGroup;
  public showContacts: boolean = false;

  public ngOnInit(): void {
    this.moveUserToFrontInContacts();
    this.setupTaskForm();
  }

  private moveUserToFrontInContacts(): void {
    this.firebaseDatabaseService.contacts().forEach(contact => {
      contact.selected = false;
    });
    this.contacts = this.firebaseDatabaseService.contacts();
    const currentUserEmail = this.firebaseAuthenticationService.auth.currentUser?.email;
    const userIndex = this.contacts.findIndex(contact => contact.email === currentUserEmail);
    if (userIndex !== -1) {
      const [userContact] = this.contacts.splice(userIndex, 1);
      this.contacts.unshift(userContact);
    }
  }

  private setupTaskForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s\-_,\.;:()]+$/)]],
      searchContact: ['']
    });
  }

  public openContacts(): void {
    this.showContacts = true;
  }

  public closeContacts(): void {
    this.showContacts = false;
    this.taskForm.get('searchContact')?.reset();
    this.contacts = this.firebaseDatabaseService.contacts();
  }

  public searchContacts(): void {
    const searchValue = this.taskForm.get('searchContact')?.value;
    if (searchValue !== '') {
      this.contacts = [];
      this.firebaseDatabaseService.contacts().forEach(contact => {
        if (contact.name.toLowerCase().includes(searchValue.toLowerCase())) {
          this.contacts.push(contact);
        }
      });
    } else {
      this.contacts = this.firebaseDatabaseService.contacts();
    }
  }

  public toggleSelectedContact(index: number): void {
    let contactSelected = this.firebaseDatabaseService.contacts()[index].selected;
    this.firebaseDatabaseService.contacts()[index].selected = !contactSelected;
  }

  public deleteSelectedContact(index: number): void {
    this.contacts[index].selected = false;
  }

  public async createTask(): Promise<void> {
  }
}
