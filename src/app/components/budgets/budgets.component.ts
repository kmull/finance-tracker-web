import { DecimalPipe, NgClass, SlicePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, filter, switchMap, tap } from 'rxjs';
import { BudgetDialogComponent } from '../../modals/budget-dialog/budget-dialog.component';
import { Budget } from '../../models/budget.model';
import { AuthService } from '../../services/auth.service';
import { BudgetService } from '../../services/budget.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    DecimalPipe,
    SlicePipe,
    NgClass,
    ToastrModule
  ],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.scss',
})
export class BudgetsComponent implements OnInit {

  private budgetService = inject(BudgetService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private toastrService = inject(ToastrService);

  budgets = signal<Budget[]>([]);
  loading = signal(false);
  error = signal('');


  displayedColumns: string[] = ['category', 'month', 'limit', 'totalSpent', 'status', 'actions'];


  ngOnInit(): void {
    this.loadBudgets();
  }

  private loadBudgets(): void {
    this.loading.set(true);
    this.budgetService.getAll()
      .pipe(
        tap(data => {
          this.budgets.set(data);
          this.loading.set(false);
        }),
        catchError(err => {
          this.toastrService.error('Błąd ładowania budżetów');
          this.error.set('Nie można załadować budżetów');
          this.loading.set(false);
          return EMPTY;
        })
      )
      .subscribe()
  }

  openAddDialog(): void {
    this.dialog.open(BudgetDialogComponent, {
      width: '60vw',
      data: null
    })
      .afterClosed()
      .pipe(
        filter(result => !!result),
        switchMap(result => this.budgetService.create(result)),
        tap(() => this.loadBudgets()),
        catchError(() => {
          this.error.set('Błąd dodawania budżetu');
          return EMPTY;
        })
      ).subscribe();
  }

  openEditDialog(budget: Budget): void {
    this.dialog.open(BudgetDialogComponent, {
      width: '60vw',
      data: budget
    })
      .afterClosed()
      .pipe(
        filter(result => !!result),
        switchMap(result => this.budgetService.update(budget.id, result)),
        tap(() => this.loadBudgets()),
        catchError(() => {
          this.error.set('Błąd aktualizacji budżetu');
          return EMPTY;
        })
      ).subscribe();
  }

  onDelete(id: number): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Potwierdzenie',
        message: 'Czy na pewno chcesz usunąć ten budżet?',
        confirmText: 'Usuń',
        cancelText: 'Anuluj'
      }
    })
      .afterClosed()
      .pipe(
        filter(result => !!result),
        tap(() => this.loadBudgets()),
        catchError(err => {
          this.toastrService.error('Błąd usuwania budżetu');
          this.error.set('Nie można usunąć budżetu');
          return EMPTY;
        })
      ).subscribe();
  }

  logout(): void {
    this.authService.logout();
  }

}


