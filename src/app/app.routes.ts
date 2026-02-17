import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { BookingComponent } from './components/booking/booking.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';


export const routes: Routes = [
  { path: '', component: EventListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'event/:id', component: EventDetailComponent },
  { path: 'book/:id', component: BookingComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin-dashboard', loadComponent:() =>import('./components/admin/admin.component').then(m=>m.AdminComponent)},
  ];
