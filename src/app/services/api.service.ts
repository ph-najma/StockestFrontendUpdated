import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import {
  LoginResponse,
  AdminLoginData,
  GoogleLoginResponse,
  LoginData,
} from '../interfaces/userInterface';

export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: Date;
  is_Blocked: boolean;
}
export interface Company {
  symbol: string;
  name: string;
  marketCap?: number;
  sector?: string;
  industry?: string;
  description?: string;
}
export interface Stock {
  symbol: string;
  price: number;
  volume: number;
  changePercent: number;
  company?: Company; // Optional field if it can be empty
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient, private router: Router) {}

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    console.log(token);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`, // Set the token in the Authorization header
    });
  }
  signup(userData: {
    name: string;
    email: string;
    password: string;
  }): Observable<any> {
    console.log('hello from signup');
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }

  verifyOtp(otpData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verifyOtp`, otpData);
  }

  resendOtp(data: any): Observable<any> {
    console.log(data);
    return this.http.post(`${this.apiUrl}/resendOtp`, data);
  }

  login(data: LoginData): Observable<LoginResponse> {
    console.log('hello from login service');
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data);
  }
  forgotPassword(data: any): Observable<any> {
    console.log('hello from forgot pass service');
    return this.http.post(`${this.apiUrl}/forgotPassword`, data);
  }
  resetPassword(data: any): Observable<any> {
    console.log('hello from reset password from rset password');
    console.log(data);
    console.log(data.email);
    return this.http.post(`${this.apiUrl}/resetPassword`, data);
  }
  userList(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/userlist`, {
      headers: this.getAuthHeaders(),
    });
  }
  loginAdmin(data: AdminLoginData): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/adminLogin`, data)
      .pipe(
        tap((response: any) => {
          localStorage.setItem('token', response.token); // Save the token
        })
      );
  }
  disableUser(userId: string): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}/disableUser/${userId}`,
      {},
      {
        headers: this.getAuthHeaders(),
      }
    );
  }
  googleLogin(id_token: string): Observable<GoogleLoginResponse> {
    console.log('hello from google services');
    return this.http.post<GoogleLoginResponse>(
      `${this.apiUrl}/auth/google/login`,
      { id_token }
    );
  }
  getHomeData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/home`);
  }
  getUserProfile(): Observable<any> {
    console.log('hello from service');
    return this.http.get(`${this.apiUrl}/Userprofile`, {
      headers: this.getAuthHeaders(),
    });
  }
  getStocks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/stocks`, {
      headers: this.getAuthHeaders(),
    });
  }
  addCompany(data: Company): Observable<Company> {
    console.log(data);
    return this.http.post<Company>(`${this.apiUrl}/addCompany`, data);
  }
  addStock(data: Stock): Observable<Stock> {
    console.log(data, 'from service');
    return this.http.post<Stock>(`${this.apiUrl}/addStock`, data);
  }
  getPortfolio(): Observable<any[]> {
    console.log('hello from service');
    return this.http.get<any[]>(`${this.apiUrl}/portfolio`, {
      headers: this.getAuthHeaders(),
    });
  }
  logout() {
    localStorage.removeItem('token');
    alert(
      'You have been logged out. Please contact support if you believe this is a mistake.'
    );
    this.router.navigate(['/login']);
  }
}
