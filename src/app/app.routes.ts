import { Routes } from '@angular/router';
import { BudgetsComponent } from './components/budgets/budgets.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { authGuard } from './guarda/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'transaction',
    component: TransactionsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'budgets',
    component: BudgetsComponent,
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
