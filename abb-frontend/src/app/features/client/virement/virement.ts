import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction.service';
import { AccountService } from '../../../core/services/account.service';
import { ClientDashboardData, TransferRequest } from '../../../models/bank.model';

@Component({
  selector: 'app-virement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './virement.html'
})
export class VirementComponent implements OnInit {
  
  private transactionService = inject(TransactionService);
  private accountService = inject(AccountService);
  private cdr = inject(ChangeDetectorRef);

  myAccount: ClientDashboardData | null = null;

  sourceAccountRib = ''; 
  beneficiaryRib = '';
  amount: number | null = null;
  motif = '';
  loading = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit() {
    this.accountService.getDashboardData().subscribe({
      next: (data) => {
        this.myAccount = data;
        this.sourceAccountRib = data.rib || "no rib"; 
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit() {
    if (!this.beneficiaryRib || !this.amount) return;

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const requestPayload: TransferRequest = {
      receiverRib: this.beneficiaryRib,
      amount: this.amount,
      description: this.motif || 'Virement'
    };

    this.transactionService.performTransfer(requestPayload).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.successMessage = response.message || `Le virement de ${this.amount} MAD a été effectué avec succès.`;
        
        if (this.myAccount && this.amount) {
          this.myAccount.solde -= this.amount;
        }

        this.beneficiaryRib = '';
        this.amount = null;
        this.motif = '';

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.error || "Une erreur est survenue lors du virement.";
        this.cdr.detectChanges();
      }
    });
  }
}