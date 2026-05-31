import { DecimalPipe } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { catchError, EMPTY, filter, switchMap, tap } from 'rxjs';
import { TransactionDialogComponent } from '../../modals/transaction-dialog/transaction-dialog.component';
import { Transaction } from '../../models/transaction.model';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSortModule,
    DecimalPipe
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {

  @ViewChild(MatSort) sort!: MatSort;

  private transactionService = inject(TransactionService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);

  sortActive = signal<string>('');
  sortDirection = signal<'asc' | 'desc' | ''>('');

  transactions = signal<Transaction[]>([]);
  loading = signal(false);
  error = signal('');
  editingId = signal<number | null>(null);
  sortBy = signal<string>('');

  displayedColumns: string[] = ['date', 'category', 'description', 'amount', 'actions'];

  ngOnInit(): void {
    this.loadTransactions();
  }

  private loadTransactions(): void {
    this.loading.set(true);
    this.transactionService.getAll(this.sortBy())
      .subscribe({
        next: (data) => {
          this.transactions.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Błąd pobierania transakcji');
          this.loading.set(false);
        }
      });
  }

  onSortChange(sort: Sort): void {
    this.sortActive.set(sort.active);
    this.sortDirection.set(sort.direction);

    if (!sort.active || sort.direction === '') {
      this.sortBy.set('');
    } else {
      const dir = sort.direction === 'asc' ? 'Asc' : 'Desc';
      this.sortBy.set(sort.active + dir);
    }
    this.loadTransactions();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      width: '60vw',
      data: null
    });

    dialogRef.afterClosed()
      .pipe(
        filter(result => !!result),
        switchMap(result => this.transactionService.create(result)),
        tap(() => this.loadTransactions()),
        catchError(() => {
          this.error.set('Błąd dodawania transakcji');
          return EMPTY;
        })
      ).subscribe();
  }

  openEditDialog(transaction: Transaction): void {
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      width: '60vw',
      data: transaction
    });

    dialogRef.afterClosed()
      .pipe(
        filter(result => !!result),
        switchMap(result => this.transactionService.update(transaction.id, result)),
        tap(() => this.loadTransactions()),
        catchError(() => {
          this.error.set('Błąd aktualizacji transakcji');
          return EMPTY;
        })
      ).subscribe();
  }

  cancelEdit(): void {
    this.editingId.set(null);
  }

  onDelete(id: number): void {
    this.transactionService.delete(id).subscribe({
      next: () => {
        this.loadTransactions();
      },
      error: () => this.error.set('Błąd usuwania transakcji')
    });
  }

  logout(): void {
    this.authService.logout();
  }

}
