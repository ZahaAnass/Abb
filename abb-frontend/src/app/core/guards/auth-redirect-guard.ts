import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authRedirectGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    let userRole = authService.getUserRole() || '';

    if (userRole.startsWith('ROLE_')) {
      userRole = userRole.substring(5);
    }

    if (userRole.toUpperCase() === 'ADMIN') {
      router.navigate(['/admin/dashboard']);
    } else {
      router.navigate(['/client/dashboard']);
    }
    
    return false;
  }

  return true;
};