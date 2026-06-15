import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Budget } from '../../models/budget.model';
import { CategoryDescriptions, CategoryType } from '../../models/enums/category-type.enum';

@Component({
  selector: 'app-budget-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  templateUrl: './budget-dialog.component.html',
  styleUrl: './budget-dialog.component.scss',
})
export class BudgetDialogComponent implements OnInit {

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<BudgetDialogComponent>);
  data = inject<Budget | null>(MAT_DIALOG_DATA);

  categories = Object.values(CategoryType);
  categoryLabels = CategoryDescriptions;

  form = this.fb.group({
    category: ['', Validators.required],
    limit: [null as number | null, [Validators.required, Validators.min(0.01)]],
    month: [new Date(), Validators.required]
  });

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue({
        category: this.data.category,
        limit: this.data.limit,
        month: new Date(this.data.month)
      })
    }
  }

  onMonthSelected(date: Date, picker: MatDatepicker<Date>): void {
    this.form.patchValue({ month: date });
    picker.close();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const date = this.form.value.month as Date;
    const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-01`;

    this.dialogRef.close({
      category: this.form.value.category!,
      limit: this.form.value.limit!,
      month
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
