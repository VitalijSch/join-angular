import { Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';

export const routes: Routes = [
    { path: '', redirectTo: '/authentication/login', pathMatch: 'full' },
    {
      path: 'authentication',
      component: AuthenticationComponent,
      children: [
        { path: 'login', component: LoginComponent },
        { path: 'signup', component: SignupComponent }
      ]
    }
  ];
