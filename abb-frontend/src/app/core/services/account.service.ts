import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from "./../../../environments/environment"
import { ClientDashboardData } from '../../models/bank.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {

  private http = inject(HttpClient);
  private dashboardUrl = `${environment.apiUrl}/client/dashboard`;

  getDashboardData() {
    return this.http.get<ClientDashboardData>(this.dashboardUrl)
  }

}
