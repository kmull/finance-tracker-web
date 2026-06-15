import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Budget, BudgetRequest } from '../models/budget.model';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:9001/api/budgets';

  getAll(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.apiUrl);
  }

  getById(id: number): Observable<Budget> {
    return this.http.get<Budget>(`${this.apiUrl}/${id}`);
  }

  create(budget: BudgetRequest): Observable<Budget> {
    return this.http.post<Budget>(this.apiUrl, budget);
  }

  update(id: number, budget: BudgetRequest): Observable<Budget> {
    return this.http.put<Budget>(`${this.apiUrl}/${id}`, budget);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
