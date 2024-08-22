import { Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { SummaryComponent } from './home/summary/summary.component';
import { AddTaskComponent } from './home/add-task/add-task.component';
import { BoardComponent } from './home/board/board.component';
import { ContactsComponent } from './home/contacts/contacts.component';
import { HelpComponent } from './home/help/help.component';

export const routes: Routes = [
  { path: '', redirectTo: '/authentication/login', pathMatch: 'full' },
  {
    path: 'authentication',
    component: AuthenticationComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent }
    ]
  },
  { path: 'home', redirectTo: '/home/summary', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: 'summary', component: SummaryComponent },
      { path: 'addTask', component: AddTaskComponent },
      { path: 'board', component: BoardComponent },
      { path: 'contacts', component: ContactsComponent },
      { path: 'help', component: HelpComponent }
    ]
  }
];
