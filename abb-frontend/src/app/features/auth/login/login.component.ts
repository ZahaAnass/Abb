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
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

      .login-root {
        font-family: 'DM Sans', sans-serif;
        min-height: 100vh;
        display: flex;
        background: #111110;
        overflow: hidden;
      }

      /* ── LEFT PANEL ─────────────────────────────────────────────── */
      .panel-left {
        position: relative;
        display: none;
        width: 52%;
        flex-direction: column;
        justify-content: space-between;
        padding: 3rem;
        overflow: hidden;
        background: #0D0D0C;
      }
      @media (min-width: 1024px) { .panel-left { display: flex; } }

      /* Geometric accent lines */
      .panel-left::before {
        content: '';
        position: absolute;
        inset: 0;
        background:
          linear-gradient(135deg, rgba(220,168,25,0.04) 0%, transparent 60%),
          radial-gradient(ellipse at 20% 80%, rgba(220,168,25,0.06) 0%, transparent 50%);
        pointer-events: none;
      }

      /* Gold vertical rule */
      .gold-rule {
        position: absolute;
        top: 0; bottom: 0; right: 0;
        width: 1px;
        background: linear-gradient(to bottom, transparent, rgba(220,168,25,0.3) 30%, rgba(220,168,25,0.3) 70%, transparent);
      }

      /* Corner ornament */
      .corner-ornament {
        position: absolute;
        top: 3rem; left: 3rem;
        width: 48px; height: 48px;
        border-top: 1px solid rgba(220,168,25,0.5);
        border-left: 1px solid rgba(220,168,25,0.5);
      }
      .corner-ornament-br {
        position: absolute;
        bottom: 3rem; right: 3rem;
        width: 48px; height: 48px;
        border-bottom: 1px solid rgba(220,168,25,0.3);
        border-right: 1px solid rgba(220,168,25,0.3);
      }

      /* Subtle grid texture */
      .grid-texture {
        position: absolute;
        inset: 0;
        background-image:
          linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
        background-size: 60px 60px;
        pointer-events: none;
      }

      .panel-left-logo {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .logo-mark {
        width: 44px;
        height: 44px;
        border: 1px solid rgba(220,168,25,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .logo-img {
        height: 28px;
        width: auto;
        object-fit: contain;
        filter: brightness(0) invert(1) opacity(0.9);
      }

      .logo-text {
        display: flex;
        flex-direction: column;
      }

      .logo-name {
        font-family: 'Playfair Display', serif;
        font-size: 1rem;
        font-weight: 500;
        color: #F5F0E8;
        letter-spacing: 0.05em;
      }

      .logo-tagline {
        font-size: 0.6rem;
        font-weight: 400;
        color: rgba(220,168,25,0.7);
        letter-spacing: 0.2em;
        text-transform: uppercase;
        margin-top: 1px;
      }

      .panel-left-hero {
        position: relative;
        z-index: 1;
      }

      .hero-label {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 2rem;
      }

      .hero-label-line {
        width: 24px;
        height: 1px;
        background: rgba(220,168,25,0.6);
      }

      .hero-label-text {
        font-size: 0.625rem;
        font-weight: 500;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        color: rgba(220,168,25,0.7);
      }

      .hero-heading {
        font-family: 'Playfair Display', serif;
        font-size: clamp(2.2rem, 3.5vw, 3rem);
        font-weight: 400;
        color: #F5F0E8;
        line-height: 1.2;
        margin-bottom: 1.5rem;
      }

      .hero-heading em {
        font-style: italic;
        color: rgba(220,168,25,0.9);
      }

      .hero-body {
        font-size: 0.875rem;
        font-weight: 300;
        color: rgba(245,240,232,0.45);
        line-height: 1.8;
        max-width: 380px;
      }

      .panel-left-footer {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .trust-badges {
        display: flex;
        gap: 2rem;
      }

      .trust-badge {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .trust-badge-value {
        font-family: 'Playfair Display', serif;
        font-size: 1.25rem;
        font-weight: 500;
        color: #F5F0E8;
      }

      .trust-badge-label {
        font-size: 0.625rem;
        font-weight: 400;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: rgba(245,240,232,0.3);
      }

      .trust-divider {
        width: 1px;
        height: 32px;
        background: rgba(245,240,232,0.1);
      }

      /* ── RIGHT PANEL ────────────────────────────────────────────── */
      .panel-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 2rem 1.5rem;
        background: #111110;
        position: relative;
      }

      /* Ambient glow */
      .panel-right::before {
        content: '';
        position: absolute;
        top: -20%;
        right: -20%;
        width: 60%;
        height: 60%;
        background: radial-gradient(ellipse, rgba(220,168,25,0.04) 0%, transparent 60%);
        pointer-events: none;
      }

      /* Mobile logo */
      .mobile-logo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 3rem;
      }
      @media (min-width: 1024px) { .mobile-logo { display: none; } }

      .mobile-logo-mark {
        width: 36px;
        height: 36px;
        border: 1px solid rgba(220,168,25,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .mobile-logo-img {
        height: 20px;
        width: auto;
        filter: brightness(0) invert(1) opacity(0.85);
      }

      .mobile-logo-name {
        font-family: 'Playfair Display', serif;
        font-size: 0.9rem;
        color: #F5F0E8;
        letter-spacing: 0.05em;
      }

      /* Form Card */
      .form-card {
        position: relative;
        z-index: 1;
        width: 100%;
        max-width: 400px;
      }

      .form-eyebrow {
        font-size: 0.625rem;
        font-weight: 500;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        color: rgba(220,168,25,0.7);
        margin-bottom: 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .form-eyebrow::before {
        content: '';
        display: block;
        width: 16px;
        height: 1px;
        background: rgba(220,168,25,0.5);
      }

      .form-heading {
        font-family: 'Playfair Display', serif;
        font-size: 2rem;
        font-weight: 400;
        color: #F5F0E8;
        margin-bottom: 0.5rem;
        line-height: 1.2;
      }

      .form-subheading {
        font-size: 0.8rem;
        font-weight: 300;
        color: rgba(245,240,232,0.4);
        margin-bottom: 2.5rem;
      }

      /* Error banner */
      .error-banner {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        background: rgba(239,68,68,0.08);
        border: 1px solid rgba(239,68,68,0.2);
        border-radius: 4px;
        padding: 0.875rem 1rem;
        margin-bottom: 1.5rem;
      }

      .error-banner-icon {
        width: 14px;
        height: 14px;
        color: #EF4444;
        flex-shrink: 0;
        margin-top: 1px;
      }

      .error-banner-text {
        font-size: 0.8rem;
        font-weight: 400;
        color: rgba(239,68,68,0.9);
        line-height: 1.5;
      }

      /* Field */
      .field {
        margin-bottom: 1.25rem;
      }

      .field-label {
        display: block;
        font-size: 0.7rem;
        font-weight: 500;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: rgba(245,240,232,0.45);
        margin-bottom: 0.5rem;
      }

      .field-input-wrap {
        position: relative;
      }

      .field-icon {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        width: 16px;
        height: 16px;
        color: rgba(245,240,232,0.25);
        pointer-events: none;
      }

      .field-input {
        width: 100%;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 4px;
        padding: 0.875rem 1rem 0.875rem 2.75rem;
        font-family: 'DM Sans', sans-serif;
        font-size: 0.875rem;
        font-weight: 400;
        color: #F5F0E8;
        outline: none;
        transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        box-sizing: border-box;
      }

      .field-input::placeholder {
        color: rgba(245,240,232,0.18);
      }

      .field-input:focus {
        border-color: rgba(220,168,25,0.4);
        background: rgba(220,168,25,0.03);
        box-shadow: 0 0 0 3px rgba(220,168,25,0.06);
      }

      /* Submit Button */
      .submit-btn {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.625rem;
        background: #DCA819;
        border: none;
        border-radius: 4px;
        padding: 1rem;
        font-family: 'DM Sans', sans-serif;
        font-size: 0.8rem;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #0D0D0C;
        cursor: pointer;
        transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        margin-top: 0.5rem;
        position: relative;
        overflow: hidden;
      }

      .submit-btn::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
        pointer-events: none;
      }

      .submit-btn:not(:disabled):hover {
        background: #C49716;
        transform: translateY(-1px);
        box-shadow: 0 8px 24px rgba(220,168,25,0.2);
      }

      .submit-btn:not(:disabled):active {
        transform: translateY(0);
      }

      .submit-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .btn-spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(13,13,12,0.3);
        border-top-color: #0D0D0C;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
      }

      @keyframes spin { to { transform: rotate(360deg); } }

      /* Divider */
      .form-divider {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin: 1.75rem 0;
      }

      .divider-line {
        flex: 1;
        height: 1px;
        background: rgba(255,255,255,0.06);
      }

      .divider-text {
        font-size: 0.65rem;
        font-weight: 400;
        letter-spacing: 0.1em;
        color: rgba(245,240,232,0.2);
        text-transform: uppercase;
      }

      /* Register link */
      .register-link {
        text-align: center;
        font-size: 0.8rem;
        font-weight: 300;
        color: rgba(245,240,232,0.35);
      }

      .register-link a {
        color: rgba(220,168,25,0.85);
        font-weight: 500;
        text-decoration: none;
        transition: color 0.2s;
      }

      .register-link a:hover {
        color: #DCA819;
      }

      /* Security note */
      .security-note {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
        margin-top: 1.75rem;
        font-size: 0.625rem;
        font-weight: 400;
        letter-spacing: 0.08em;
        color: rgba(245,240,232,0.2);
        text-transform: uppercase;
      }

      .security-icon {
        width: 10px;
        height: 10px;
        color: rgba(245,240,232,0.2);
      }
    </style>

    <div class="login-root">

      <!-- ── LEFT PANEL ─────────────────────────────────────────── -->
      <div class="panel-left">
        <div class="gold-rule"></div>
        <div class="corner-ornament"></div>
        <div class="corner-ornament-br"></div>
        <div class="grid-texture"></div>

        <!-- Logo -->
        <div class="panel-left-logo">
          <div class="logo-mark">
            <img src="logo.png" alt="Al Barid Bank" class="logo-img" />
          </div>
          <div class="logo-text">
            <span class="logo-name">Al Barid Bank</span>
            <span class="logo-tagline">Banque Postale · Maroc</span>
          </div>
        </div>

        <!-- Hero -->
        <div class="panel-left-hero">
          <div class="hero-label">
            <span class="hero-label-line"></span>
            <span class="hero-label-text">Espace Sécurisé</span>
          </div>
          <h1 class="hero-heading">
            La banque <em>au service</em><br>
            de votre avenir
          </h1>
          <p class="hero-body">
            Accédez à vos comptes, effectuez vos virements et gérez votre patrimoine en toute sécurité, à tout moment.
          </p>
        </div>

        <!-- Footer stats -->
        <div class="panel-left-footer">
          <div class="trust-badges">
            <div class="trust-badge">
              <span class="trust-badge-value">4M+</span>
              <span class="trust-badge-label">Clients actifs</span>
            </div>
            <div class="trust-divider"></div>
            <div class="trust-badge">
              <span class="trust-badge-value">1912</span>
              <span class="trust-badge-label">Fondée en</span>
            </div>
            <div class="trust-divider"></div>
            <div class="trust-badge">
              <span class="trust-badge-value">256-bit</span>
              <span class="trust-badge-label">Chiffrement</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── RIGHT PANEL ────────────────────────────────────────── -->
      <div class="panel-right">

        <!-- Mobile logo -->
        <div class="mobile-logo">
          <div class="mobile-logo-mark">
            <img src="logo.png" alt="Al Barid Bank" class="mobile-logo-img" />
          </div>
          <span class="mobile-logo-name">Al Barid Bank</span>
        </div>

        <!-- Form card -->
        <div class="form-card">
          <p class="form-eyebrow">Connexion</p>
          <h2 class="form-heading">Bon retour</h2>
          <p class="form-subheading">Veuillez saisir vos identifiants pour accéder à votre espace.</p>

          <!-- Error -->
          <div *ngIf="errorMessage" class="error-banner">
            <svg class="error-banner-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke-width="1.5"/>
              <path d="M12 8v4M12 16h.01" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span class="error-banner-text">{{ errorMessage }}</span>
          </div>

          <form (ngSubmit)="onLogin()" #loginForm="ngForm">

            <!-- Email -->
            <div class="field">
              <label class="field-label">Adresse e-mail</label>
              <div class="field-input-wrap">
                <svg class="field-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <input
                  type="email"
                  name="email"
                  [(ngModel)]="email"
                  required
                  placeholder="votre.email@exemple.com"
                  class="field-input"
                />
              </div>
            </div>

            <!-- Password -->
            <div class="field">
              <label class="field-label">Mot de passe</label>
              <div class="field-input-wrap">
                <svg class="field-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke-width="1.5"/>
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <input
                  type="password"
                  name="password"
                  [(ngModel)]="password"
                  required
                  placeholder="••••••••••"
                  class="field-input"
                />
              </div>
            </div>

            <!-- Submit -->
            <button
              type="submit"
              [disabled]="!loginForm.form.valid || loading"
              class="submit-btn"
            >
              <div *ngIf="loading" class="btn-spinner"></div>
              <span>{{ loading ? 'Connexion…' : 'Se connecter' }}</span>
              <svg *ngIf="!loading" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 12h14M13 6l6 6-6 6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

          </form>

          <div class="form-divider">
            <div class="divider-line"></div>
            <span class="divider-text">Pas encore client ?</span>
            <div class="divider-line"></div>
          </div>

          <p class="register-link">
            <a routerLink="/register">Ouvrir un compte →</a>
          </p>

          <div class="security-note">
            <svg class="security-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Connexion chiffrée SSL · Données protégées
          </div>
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
      error: () => {
        this.loading = false;
        this.errorMessage = 'Email ou mot de passe incorrect. Veuillez réessayer.';
      }
    });
  }
}