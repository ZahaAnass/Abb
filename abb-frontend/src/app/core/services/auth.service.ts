import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { LoginRequest, AuthResponse, DecodedToken } from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Modern Angular way to inject the HTTP client
  private http = inject(HttpClient);
  
  // This points to http://localhost:8080/api/auth/login
  private apiUrl = `${environment.apiUrl}/auth/login`;

  // 1. The Login Method: Sends data to Spring Boot
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl, credentials).pipe(
      tap((response) => {
        // If successful, save the token safely in localStorage
        if (response.token) {
          localStorage.setItem('JWT_TOKEN', response.token);
        }
      })
    );
  }

  // 2. Retrieve the token
  getToken(): string | null {
    return localStorage.getItem('JWT_TOKEN');
  }

  // 3. Check if user is currently logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // 4. Logout (destroy the token)
  logout(): void {
    localStorage.removeItem('JWT_TOKEN');
  }

  // 5. Decode the token to get the user's email
  getUserEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.sub; // 'sub' contains the email in our Spring Boot setup
    } catch (error) {
      return null;
    }
  }

  // 6. Determine Role (Admin vs Client)
  getUserRole(): 'ADMIN' | 'CLIENT' | null {
    const email = this.getUserEmail();
    if (!email) return null;

    // If it's the default admin email, they are an ADMIN. Otherwise, CLIENT.
    return email === 'admin@bank.com' ? 'ADMIN' : 'CLIENT';
  }
}