import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { Transaction } from '../../../models/bank.model';

@Component({
  selector: 'app-admin-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-transactions.html',
})
export class AdminTransactionsComponent implements OnInit {
  private adminService = inject(AdminService);
  private cdr = inject(ChangeDetectorRef);

  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  paginatedTransactions: Transaction[] = [];
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  isColumnDropdownOpen = false;
  columnVisibility = {
    date: true,
    description: true,
    sender: true,
    receiver: true,
    amount: true,
  };

  sortColumn = 'transactionDate';
  sortDirection: 'desc' | 'asc' = 'desc';

  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.fetchTransactions();
  }

  fetchTransactions() {
    this.adminService.getAllTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = "Impossible de charger l'historique des transactions.";
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  applyFilter() {
    if (!this.searchTerm) {
      this.filteredTransactions = [...this.transactions];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredTransactions = this.transactions.filter(
        (t) =>
          (t.description || '').toLowerCase().includes(term) ||
          t.senderRib.toLowerCase().includes(term) ||
          t.receiverRib.toLowerCase().includes(term),
      );
    }
    this.currentPage = 1;
    this.applySort();
  }

  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applySort();
  }

  applySort() {
    if (this.sortColumn) {
      this.filteredTransactions.sort((a: any, b: any) => {
        let valA = a[this.sortColumn];
        let valB = b[this.sortColumn];

        if (this.sortColumn === 'transactionDate') {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        } else {
          if (typeof valA === 'string') valA = valA.toLowerCase();
          if (typeof valB === 'string') valB = valB.toLowerCase();
        }

        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredTransactions.length / this.pageSize) || 1;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedTransactions = this.filteredTransactions.slice(
      startIndex,
      startIndex + this.pageSize,
    );
    this.cdr.detectChanges();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
}
