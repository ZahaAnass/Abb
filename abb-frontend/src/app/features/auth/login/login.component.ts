import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // Required to read the HTML inputs
  templateUrl: './login.component.html', // Must match your HTML file name!
  styleUrl: './login.component.css'      // Must match your CSS file name!
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    this.errorMessage = ''; 

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        const role = this.authService.getUserRole();
        
        if (role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']); 
        } else {
          this.router.navigate(['/client/dashboard']); 
        }
      },
      error: (err) => {
        this.errorMessage = 'Email ou mot de passe incorrect.';
        console.error("Login failed:", err);
      }
    });
  }
}