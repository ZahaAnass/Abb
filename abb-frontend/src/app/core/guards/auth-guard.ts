import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const expectedRole = route.data['role'];
  let userRole = authService.getUserRole() || '';

  if (userRole.startsWith('ROLE_')) {
    userRole = userRole.substring(5);
  }
  
  userRole = userRole.toUpperCase(); 

  if (expectedRole && expectedRole.toUpperCase() !== userRole) {
    
    if (userRole === 'ADMIN') {
      router.navigate(['/admin/dashboard']);
    } else {
      router.navigate(['/client/dashboard']);
    }
    
    return false;
  }

  return true;
};