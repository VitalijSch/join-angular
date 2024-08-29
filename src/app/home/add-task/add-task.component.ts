import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HomeService } from '../../services/home/home.service';
import { FirebaseAuthenticationService } from '../../services/firebase-authentication/firebase-authentication.service';
import { FirebaseDatabaseService } from '../../services/firebase-database/firebase-database.service';

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

  public taskForm!: FormGroup;

  public showContacts: boolean = false;

  public ngOnInit(): void {
    this.setupContactForm();
  }

  private setupContactForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s\-_,\.;:()]+$/)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      phoneNumber: ['', [Validators.pattern(/^\+?[0-9]{7,15}$/)]]
    });
  }

  public openContacts(): void {
    this.showContacts = true;
  }

  public closeContacts(): void {
    this.showContacts = false;
  }

  public toggleSelectedContact(index: number): void {
    let contactSelected = this.firebaseDatabaseService.contacts()[index].selected;
    this.firebaseDatabaseService.contacts()[index].selected = !contactSelected;
  }

  public async createTask(): Promise<void> {
  }
}
