import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AccountService } from '../../core/services/account.service';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app-layout.html'
})
export class AppLayoutComponent implements OnInit {
  isMobileMenuOpen = false;
  userEmail = 'Utilisateur';
  userRole = '';
  balance = 0;

  private authService = inject(AuthService);
  private accountService = inject(AccountService);
  private router = inject(Router);

  ngOnInit() {
    this.userEmail = this.authService.getUserEmail() || 'Client ABB';
    this.userRole = this.authService.getUserRole()?.replace('ROLE_', '') || 'CLIENT';
    this.accountService.getDashboardData().subscribe(data => {
      this.balance = data.solde;
    });
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