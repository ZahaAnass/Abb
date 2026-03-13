import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TransferRequest, Transaction } from '../../models/bank.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/transactions`;

  performTransfer(request: TransferRequest) {
    return this.http.post(`${this.apiUrl}/transfer`, request);
  }

  getHistory(): Observable<{message: string, transactions: Transaction[]}> {
    return this.http.get<{message: string, transactions: Transaction[]}>(`${this.apiUrl}/history`);
  }

  downloadPdfStatement(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/pdf`, {
      responseType: 'blob' 
    });
  }

  downloadExcelStatement(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/excel`, {
      responseType: 'blob' 
    });
  }
}
