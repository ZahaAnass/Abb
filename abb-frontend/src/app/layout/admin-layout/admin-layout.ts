import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.html'
})
export class AdminLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  isMobileMenuOpen = false;
  userEmail = 'admin@bank.com';
  userRole = 'Administrator';

  ngOnInit() {
    this.userEmail = this.authService.getUserEmail() || 'admin@bank.com';
    this.userRole = this.authService.getUserRole()?.replace('ROLE_', '') || 'ADMIN';
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}