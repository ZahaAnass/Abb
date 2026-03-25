import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-create-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-create-employee.html'
})
export class AdminCreateEmployeeComponent {
  private adminService = inject(AdminService);
  private router = inject(Router);

  newEmployee = {
    name: '',
    email: '',
    role: 'GUICHETIER',
    division: '',
    agence: 'Casablanca'
  };

  submitting = false;
  formError = '';
  successMessage = '';

  onSubmit() {
    if (!this.newEmployee.name || !this.newEmployee.email) {
      this.formError = 'Please fill in all required fields.';
      return;
    }

    this.submitting = true;
    this.formError = '';
    this.successMessage = '';

    this.adminService.createEmployee(this.newEmployee).subscribe({
      next: () => {
        this.successMessage = 'Employee account created successfully.';
        this.submitting = false;
        setTimeout(() => {
          this.router.navigate(['/admin/employees']);
        }, 1500);
      },
      error: (err) => {
        this.formError = 'Creation failed. The email address might already be in use.';
        this.submitting = false;
      }
    });
  }
}