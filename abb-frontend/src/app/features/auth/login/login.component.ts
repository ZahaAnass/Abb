import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex bg-white">
      
      <div class="hidden lg:flex w-1/2 bg-abb-dark flex-col justify-center items-center p-12 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-2 bg-abb-yellow"></div>
        <div class="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

        <div class="z-10 text-center">
          <div class="bg-white p-4 rounded-2xl shadow-xl mb-8 inline-block border border-gray-100">
            <img src="logo.png" alt="Logo Al Barid Bank" class="h-16 w-auto object-contain" />
          </div>
          <h1 class="text-4xl font-bold text-white mb-4 tracking-wide">Al Barid Bank</h1>
          <p class="text-gray-300 text-lg max-w-md mx-auto">
            Gérez vos finances en toute sécurité. Accédez à votre espace client 24h/24 et 7j/7.
          </p>
        </div>
      </div>

      <div class="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div class="w-full max-w-md">
          
          <div class="lg:hidden flex flex-col items-center mb-8">
            <div class="bg-white p-4 rounded-2xl shadow-xl mb-8 inline-block border border-gray-100">
              <img src="logo.png" alt="Logo Al Barid Bank" class="h-16 w-auto object-contain" />
            </div>
          </div>

          <h2 class="text-3xl font-bold text-gray-900 mb-2">Bon retour !</h2>
          <p class="text-gray-500 mb-8">Veuillez entrer vos identifiants pour continuer.</p>

          <div *ngIf="errorMessage" class="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm font-medium border border-red-100">
            {{ errorMessage }}
          </div>

          <form (ngSubmit)="onLogin()" #loginForm="ngForm" class="space-y-6">
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                name="email"
                [(ngModel)]="email" 
                required 
                placeholder="votre.email@exemple.com"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-abb-yellow focus:border-abb-yellow outline-none transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
              <input 
                type="password" 
                name="password"
                [(ngModel)]="password" 
                required 
                placeholder="••••••••"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-abb-yellow focus:border-abb-yellow outline-none transition-all"
              />
            </div>

            <button 
              type="submit" 
              [disabled]="!loginForm.form.valid || loading"
              class="w-full bg-abb-yellow hover:bg-yellow-500 text-white font-bold py-3.5 px-4 rounded-lg transition-colors flex justify-center items-center shadow-md disabled:opacity-70">
              <span *ngIf="!loading">Se connecter</span>
              <svg *ngIf="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>

          </form>

          <p class="text-center text-gray-600 mt-8">
            Nouveau client ? 
            <a routerLink="/register" class="text-abb-yellow font-bold hover:underline">Créer un compte</a>
          </p>

        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  onLogin() {
    if (!this.email || !this.password) return;
    this.loading = true;
    this.errorMessage = '';
    
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        const role = this.authService.getUserRole();
        if (role && role.includes('ADMIN')) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/client/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Email ou mot de passe incorrect.';
      }
    });
  }
}