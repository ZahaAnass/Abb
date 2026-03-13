import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { AdminDashboardData } from '../../../models/bank.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html'
})
export class AdminDashboardComponent implements OnInit {
  
  private adminService = inject(AdminService);
  private cdr = inject(ChangeDetectorRef);

  stats: AdminDashboardData | null = null;
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.fetchStats();
  }

  fetchStats() {
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching admin stats:', err);
        this.errorMessage = 'Impossible de charger les statistiques. Veuillez vérifier la connexion au serveur.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}