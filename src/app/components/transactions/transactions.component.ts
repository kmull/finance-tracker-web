import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { Transaction, TransactionRequest } from '../../models/transaction.model';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';

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
    DecimalPipe
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {

  private transactionService = inject(TransactionService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  transactions = signal<Transaction[]>([]);
  loading = signal(false);
  error = signal('');
  editingId = signal<number | null>(null);

  displayedColumns: string[] = ['date', 'category', 'description', 'amount', 'actions'];

  form = this.fb.group({
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    category: ['', Validators.required],
    description: [''],
    date: [new Date(), Validators.required]
  });

  ngOnInit(): void {
    this.loadTransactions();
  }

  private loadTransactions(): void {
    this.loading.set(true);
    this.transactionService.getAll()
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

  onSubmit(): void {
    if (this.form.invalid) return;

    const value = this.form.value;
    const request: TransactionRequest = {
      amount: value.amount!,
      category: value.category!,
      description: value.description || '',
      date: new Date(value.date!).toISOString().split('T')[0]
    };

    if (this.editingId()) {
      this.transactionService.update(this.editingId()!, request).subscribe({
        next: () => {
          this.editingId.set(null);
          this.form.reset();
          this.loadTransactions();
        },
        error: () => this.error.set('Błąd aktualizacji transakcji')
      })
    } else {
      this.transactionService.create(request).subscribe({
        next: () => {
          this.form.reset();
          this.loadTransactions();
        },
        error: () => this.error.set('Błąd dodawania transakcji')
      });
    }

  }

  onEdit(transaction: Transaction): void {
    this.editingId.set(transaction.id);
    this.form.patchValue({
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      date: new Date(transaction.date)
    });
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
