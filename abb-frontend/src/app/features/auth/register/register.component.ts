import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
// Import your auth service if it handles registration
// import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex bg-white flex-row-reverse">
      
      <div class="hidden lg:flex w-1/2 bg-abb-dark flex-col justify-center items-center p-12 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-full h-2 bg-abb-yellow"></div>
        <div class="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

        <div class="z-10 text-center">
          <div class="bg-white p-4 rounded-2xl shadow-xl mb-8 inline-block border border-gray-100">
            <img src="logo.png" alt="Logo Al Barid Bank" class="h-16 w-auto object-contain" />
          </div>
          <h1 class="text-4xl font-bold text-white mb-4">Rejoignez-nous</h1>
          <p class="text-gray-300 text-lg max-w-md mx-auto">
            Ouvrez votre compte en quelques minutes et profitez de tous nos services digitaux.
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

          <h2 class="text-3xl font-bold text-gray-900 mb-2">Créer un compte</h2>
          <p class="text-gray-500 mb-8">Veuillez remplir vos informations.</p>

          <form (ngSubmit)="onRegister()" #registerForm="ngForm" class="space-y-5">
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Nom complet</label>
              <input 
                type="text" 
                name="fullName"
                [(ngModel)]="fullName" 
                required 
                placeholder="Jean Dupont"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-abb-yellow focus:border-abb-yellow outline-none transition-all"
              />
            </div>

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
              [disabled]="!registerForm.form.valid || loading"
              class="w-full bg-abb-yellow hover:bg-yellow-500 text-white font-bold py-3.5 px-4 rounded-lg transition-colors flex justify-center items-center shadow-md mt-6 disabled:opacity-70">
              <span *ngIf="!loading">S'inscrire</span>
            </button>

          </form>

          <p class="text-center text-gray-600 mt-8">
            Vous avez déjà un compte ? 
            <a routerLink="/login" class="text-abb-yellow font-bold hover:underline">Connectez-vous</a>
          </p>

        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  fullName = '';
  email = '';
  password = '';
  loading = false;

  private router = inject(Router);
  private authService = inject(AuthService); 

  onRegister() {
    if (!this.fullName || !this.email || !this.password) return;
    
    this.loading = true;
    
    const requestPayload = {
      name: this.fullName,
      email: this.email,
      password: this.password
    };

    this.authService.register(requestPayload).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/']); 
      },
      error: (err) => {
        this.loading = false;
        console.error("Erreur d'inscription:", err);
        alert("L'inscription a échoué. Cet email est peut-être déjà utilisé.");
      }
    });
  }
}