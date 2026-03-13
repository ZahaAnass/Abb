import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { ClientDashboardComponent } from './features/client/client-dashboard/client-dashboard';
import { VirementComponent } from './features/client/virement/virement';
import { authGuard } from './core/guards/auth-guard';
import { authRedirectGuard } from './core/guards/auth-redirect-guard';
import { AppLayoutComponent } from './layout/app-layout/app-layout';
import { RegisterComponent } from './features/auth/register/register.component';
import { HistoryComponent } from './features/client/history/history';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [authRedirectGuard] 
  },
  { 
    path: 'register', 
    component: RegisterComponent,
    canActivate: [authRedirectGuard] 
  },

  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent) },
      { path: 'clients', loadComponent: () => import('./features/admin/admin-clients/admin-clients').then(m => m.AdminClientsComponent) },
      { path: 'transactions', loadComponent: () => import('./features/admin/admin-transactions/admin-transactions').then(m => m.AdminTransactionsComponent) },
      { path: 'employees', loadComponent: () => import('./features/admin/admin-employees/admin-employees').then(m => m.AdminEmployeesComponent) },
      { path: 'create-employee', loadComponent: () => import('./features/admin/admin-create-employee/admin-create-employee').then(m => m.AdminCreateEmployeeComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { 
    path: 'client', 
    component: AppLayoutComponent, 
    canActivate: [authGuard], 
    data: { role: 'CLIENT' },
    children: [
      { path: 'dashboard', component: ClientDashboardComponent },
      { path: 'virement', component: VirementComponent },
      { path: 'history', component: HistoryComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];