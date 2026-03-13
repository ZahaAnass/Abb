import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { ClientDashboardData, Transaction } from '../../../models/bank.model';

interface UITransaction extends Transaction {
  uiType: 'CREDIT' | 'DEBIT';
}

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-dashboard.html'
})
export class ClientDashboardComponent implements OnInit {
  
  private accountService = inject(AccountService);
  private cdr = inject(ChangeDetectorRef);
  
  dashboardData: ClientDashboardData | null = null;
  uiTransactions: UITransaction[] = [];
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.accountService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        
        if (data.recentTransactions) {
          this.uiTransactions = data.recentTransactions.map(trx => ({
            ...trx,
            uiType: trx.receiverRib === data.rib ? 'CREDIT' : 'DEBIT'
          }));
        }
        
        this.loading = false;
        
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error fetching dashboard data:', err);
        this.errorMessage = 'Impossible de charger vos données bancaires. Veuillez réessayer plus tard.';
        this.loading = false;
        
        this.cdr.detectChanges();
      }
    });
  }
}