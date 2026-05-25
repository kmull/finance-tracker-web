import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Transaction, TransactionRequest } from '../../models/transaction.model';

@Component({
  selector: 'app-transaction-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './transaction-dialog.component.html',
  styleUrl: './transaction-dialog.component.scss',
})
export class TransactionDialogComponent {

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TransactionDialogComponent>);
  data = inject<Transaction | null>(MAT_DIALOG_DATA)

  form = this.fb.group({
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    category: ['', Validators.required],
    description: [''],
    date: [new Date(), Validators.required]
  });

  constructor() {
    if (this.data) {
      this.form.patchValue({
        amount: this.data.amount,
        category: this.data.category,
        description: this.data.description,
        date: new Date(this.data.date)
      });
    }
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

    this.dialogRef.close(request);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
