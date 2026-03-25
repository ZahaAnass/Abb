import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-employees.html'
})
export class AdminEmployeesComponent implements OnInit {
  
  private adminService = inject(AdminService);
  private cdr = inject(ChangeDetectorRef);

  // Master Data
  employees: any[] = [];
  
  // Table State
  filteredEmployees: any[] = [];
  paginatedEmployees: any[] = [];
  
  // Filter State
  searchTerm = '';
  selectedRole = 'All Roles';
  selectedAgence = 'All Agences';

  // Sorting State
  sortColumn = 'creationDate';
  sortDirection: 'desc' | 'asc' = 'desc';

  // Pagination State
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.loading = true;
    this.adminService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Unable to load the employee list.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // 🔍 1. Filter Data (Search + Dropdowns)
  applyFilters() {
    this.filteredEmployees = this.employees.filter(emp => {
      const term = this.searchTerm.toLowerCase();
      const matchesSearch = !term || 
        emp.name?.toLowerCase().includes(term) || 
        emp.email?.toLowerCase().includes(term);

      const empRole = emp.role || 'ADMIN';
      const matchesRole = this.selectedRole === 'All Roles' || empRole === this.selectedRole;

      const empAgence = emp.agence || 'N/A';
      const matchesAgence = this.selectedAgence === 'All Agences' || empAgence === this.selectedAgence;

      return matchesSearch && matchesRole && matchesAgence;
    });
    
    this.currentPage = 1;
    this.applySort();
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedRole = 'All Roles';
    this.selectedAgence = 'All Agences';
    this.applyFilters();
  }

  refreshData() {
    this.fetchEmployees();
  }

  // ↕️ 2. Sort Data
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
      this.filteredEmployees.sort((a: any, b: any) => {
        let valA = a[this.sortColumn] || '';
        let valB = b[this.sortColumn] || '';

        if (this.sortColumn === 'creationDate') {
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

  // 📄 3. Paginate Data
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.pageSize) || 1;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedEmployees = this.filteredEmployees.slice(startIndex, startIndex + this.pageSize);
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

  // UI Helper
  getRoleBadgeClass(role: string): string {
    const r = (role || 'ADMIN').toUpperCase();
    if (r === 'ADMIN') return 'bg-red-100 text-red-700 border-red-200';
    if (r === 'MANAGER') return 'bg-green-100 text-green-700 border-green-200';
    if (r === 'GUICHETIER') return 'bg-gray-100 text-gray-700 border-gray-200';
    return 'bg-blue-100 text-blue-700 border-blue-200'; 
  }
}