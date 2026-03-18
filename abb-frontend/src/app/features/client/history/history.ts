import { Component, OnInit, inject, ChangeDetectorRef, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../core/services/transaction.service';
import { AccountService } from '../../../core/services/account.service';
import { Transaction } from '../../../models/bank.model';

interface UITransaction extends Transaction {
  uiType: 'CREDIT' | 'DEBIT';
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.html'
})
export class HistoryComponent implements OnInit {

  private transactionService = inject(TransactionService);
  private accountService = inject(AccountService);
  private cdr = inject(ChangeDetectorRef);

  uiTransactions: UITransaction[] = [];
  loading = true;
  downloadingPdf = false;
  downloadingExcel = false;
  errorMessage = '';

  // ── Computed summary values used by the template ──────────────────────────
  get creditCount(): number {
    return this.uiTransactions.filter(t => t.uiType === 'CREDIT').length;
  }

  get debitCount(): number {
    return this.uiTransactions.filter(t => t.uiType === 'DEBIT').length;
  }

  get totalCredit(): number {
    return this.uiTransactions
      .filter(t => t.uiType === 'CREDIT')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  get totalDebit(): number {
    return this.uiTransactions
      .filter(t => t.uiType === 'DEBIT')
      .reduce((sum, t) => sum + t.amount, 0);
  }
  // ──────────────────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory() {
    this.accountService.getDashboardData().subscribe({
      next: (accountData) => {
        const myRib = accountData.rib;

        this.transactionService.getHistory().subscribe({
          next: (response: any) => {
            const history: Transaction[] = response.transactions || [];

            this.uiTransactions = history.map(trx => ({
              ...trx,
              uiType: trx.receiverRib === myRib ? 'CREDIT' : 'DEBIT'
            }));

            this.uiTransactions.sort(
              (a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
            );

            this.loading = false;
            this.cdr.detectChanges();
          },
          error: () => {
            this.errorMessage = "Impossible de charger l'historique des transactions.";
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des données du compte.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  downloadPdf() {
    this.downloadingPdf = true;
    this.cdr.detectChanges();

    this.transactionService.downloadPdfStatement().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'releve_bancaire.pdf';
        link.click();
        window.URL.revokeObjectURL(url);
        this.downloadingPdf = false;
        this.cdr.detectChanges();
      },
      error: () => {
        alert('Impossible de télécharger le relevé PDF pour le moment.');
        this.downloadingPdf = false;
        this.cdr.detectChanges();
      }
    });
  }

  downloadExcel() {
    this.downloadingExcel = true;
    this.cdr.detectChanges();

    this.transactionService.downloadExcelStatement().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'releve_bancaire.xlsx';
        link.click();
        window.URL.revokeObjectURL(url);
        this.downloadingExcel = false;
        this.cdr.detectChanges();
      },
      error: () => {
        alert('Impossible de télécharger le relevé Excel pour le moment.');
        this.downloadingExcel = false;
        this.cdr.detectChanges();
      }
    });
  }
}