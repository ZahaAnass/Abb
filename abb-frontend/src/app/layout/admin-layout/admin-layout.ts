import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.html'
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isMobileMenuOpen = false;

  // Assuming you have a way to get the current user from your AuthService
  // If not, you can hardcode this to 'Admin' for now!
  userEmail = 'admin@bank.com'; 
  userRole = 'Administrateur';

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}