import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction, TransactionRequest } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:9001/api/transactions';

  getAll(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  create(data: TransactionRequest): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

  update(id: number, data: TransactionRequest): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/${id}`, data);
  }

}
