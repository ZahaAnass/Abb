import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-clients.html',
})
export class AdminClientsComponent implements OnInit {
  private adminService = inject(AdminService);
  private cdr = inject(ChangeDetectorRef);

  clients: any[] = [];
  filteredClients: any[] = [];
  paginatedClients: any[] = [];
  searchTerm = '';
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  isColumnDropdownOpen = false;
  columnVisibility = {
    name: true,
    email: true,
    rib: true,
    solde: true,
    status: true,
  };

  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.fetchClients();
  }

  fetchClients() {
    this.adminService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Impossible de charger la liste des clients.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  applyFilter() {
    if (!this.searchTerm) {
      this.filteredClients = [...this.clients];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredClients = this.clients.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term) ||
          c.rib.toLowerCase().includes(term),
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
      this.filteredClients.sort((a, b) => {
        let valA = a[this.sortColumn];
        let valB = b[this.sortColumn];

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredClients.length / this.pageSize) || 1;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedClients = this.filteredClients.slice(startIndex, startIndex + this.pageSize);
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