import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, ObservedValueOf, tap, of } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import {
  LoginResponse,
  AdminLoginData,
  GoogleLoginResponse,
  LoginData,
} from '../interfaces/userInterface';
import { ResponseModel } from '../interfaces/userInterface';
// import { environment } from '../../environments/environment.';
import { environment } from '../../environments/environment.prod';
import { response } from 'express';

export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: Date;
  is_Blocked: boolean;
}
export interface Transaction {
  _id: string;
  buyer: User;
  seller: User;
  type: string;
  stock: Stock;
  quantity: number;
  price: number;
  totalAmount: number;
  completedAt: Date;
  status: string;
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
  id?: string;
  symbol: string;
  open?: number;
  change: number;
  price: number;
  volume: number;
  changePercent: number;
  company?: Company;
}
export interface PortfolioItem {
  stock: Stock;
  quantity: number;
  currentValue?: number;
  overallProfit?: number;
  todaysProfit?: number;
  totalValue?: number;
  allocation?: number;
}

export interface PortfolioResponse {
  user: User;
  portfolio: PortfolioItem[];
  totalPortfolioValue: number;
  overallProfit: number;
  todaysProfit: number;
}

export interface IWatchlist {
  user: User | null;
  stocks: { stockId: Stock; addedAt: Date }[];
  name: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private userCache: { [page: number]: any } = {};

  constructor(private http: HttpClient, private router: Router) {}

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    console.log(token);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
  signup(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }

  verifyOtp(otpData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verifyOtp`, otpData);
  }

  resendOtp(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/resendOtp`, data);
  }

  login(data: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data);
  }
  forgotPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgotPassword`, data);
  }
  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/resetPassword`, data);
  }

  userList(page: number, limit: number): Observable<any> {
    if (this.userCache[page]) {
      console.log(`Returning cached data for page ${page}`);
      return of(this.userCache[page]); // Return cached data as an observable
    }
    return this.http
      .get<any>(`${this.apiUrl}/userlist?page=${page}&limit=${limit}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((response) => {
          console.log(`Caching data for page ${page}`);
          this.userCache[page] = response;
        })
      );
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
    return this.http.post<GoogleLoginResponse>(
      `${this.apiUrl}/auth/google/login`,
      { id_token }
    );
  }
  getHomeData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/adminHome`);
  }
  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Userprofile`, {
      headers: this.getAuthHeaders(),
    });
  }
  getStocks(): Observable<ResponseModel<Stock[]>> {
    return this.http.get<ResponseModel<Stock[]>>(`${this.apiUrl}/stocks`, {
      headers: this.getAuthHeaders(),
    });
  }
  updateUserPortfolio(updatedPortfolio: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/updatePortfolio`,
      updatedPortfolio
    );
  }
  addCompany(data: Company): Observable<Company> {
    return this.http.post<Company>(`${this.apiUrl}/addCompany`, data);
  }
  addStock(data: Stock): Observable<Stock> {
    return this.http.post<Stock>(`${this.apiUrl}/addStock`, data);
  }
  getPortfolio(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/portfolio`, {
      headers: this.getAuthHeaders(),
    });
  }
  getTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/transactions`, {
      headers: this.getAuthHeaders(),
    });
  }
  getAllTrans(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/allTransactions`, {
      headers: this.getAuthHeaders(),
    });
  }
  getUserPortfolio(userId: string | null): Observable<PortfolioResponse> {
    return this.http.get<PortfolioResponse>(
      `${this.apiUrl}/userPortfolio/${userId}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }
  getTotalFees(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getFees`, {
      headers: this.getAuthHeaders(),
    });
  }
  getLimits(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/limit`, {
      headers: this.getAuthHeaders(),
    });
  }
  saveLimits(limits: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/updateLimit`, limits, {
      headers: this.getAuthHeaders(),
    });
  }

  createPomotions(promotionData: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/createPromotions`,
      promotionData
    );
  }
  addToWatchlist(data: IWatchlist): Observable<any> {
    return this.http.post<IWatchlist>(
      `${this.apiUrl}/ensureAndAddStock`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }
  getWatchlist(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getWatchlist`, {
      headers: this.getAuthHeaders(),
    });
  }
  createOrder(amount: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/create-order`,
      { amount },
      { headers: this.getAuthHeaders() }
    );
  }
  verifyPayment(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-payment`, payload, {
      headers: this.getAuthHeaders(),
    });
  }
  getPromotions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/promotions`, {
      headers: this.getAuthHeaders(),
    });
  }
  getTradeDiary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tradeDiary`, {
      headers: this.getAuthHeaders(),
    });
  }
  getPurchasedCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getPurchased`, {
      headers: this.getAuthHeaders(),
    });
  }
  getAssignedCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAssigned`, {
      headers: this.getAuthHeaders(),
    });
  }
  createSession(data: any) {
    return this.http.post(`${this.apiUrl}/createSession`, data, {
      headers: this.getAuthHeaders(),
    });
  }
  getSession() {
    return this.http.get(`${this.apiUrl}/getSessions`, {
      headers: this.getAuthHeaders(),
    });
  }
  getSessionById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getSessionById/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
  updateSession(sessionId: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/updateSession/${sessionId}`, data, {
      headers: this.getAuthHeaders(),
    });
  }
  cancelSession(id: string, newStatus: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/cancelSession/${id}`,
      { status: newStatus },
      {
        headers: this.getAuthHeaders(),
      }
    );
  }
  getActiveSessions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/activeSessions`, {
      headers: this.getAuthHeaders(),
    });
  }
  getUserId(): string | null {
    const token = sessionStorage.getItem('token'); // or localStorage, depending on where you store it
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); // Decode the token
        return decodedToken?.userId || null; // Adjust the key based on your token structure
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }
  searchStocks(query: string): Observable<any[]> {
    let params = new HttpParams();
    if (query) {
      params = params.append('q', query);
    }
    return this.http.get<any[]>(`${this.apiUrl}/search`, {
      params: params,
      headers: this.getAuthHeaders(),
    });
  }
  generatePrompt(prompt: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate`, { prompt });
  }
  logout() {
    localStorage.removeItem('token');
    alert(
      'You have been logged out. Please contact support if you believe this is a mistake.'
    );
    this.router.navigate(['/login']);
  }
  getInitialData() {
    return Promise.all([
      this.getStocks().toPromise(),
      this.getUserProfile().toPromise(),
    ]).then(([stocksResponse, userResponse]) => ({
      stocks: stocksResponse?.data || [],
      user: userResponse?.data || null,
      portfolio: userResponse?.data.portfolio || [],
      balance: userResponse?.data.balance || 0,
    }));
  }
  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<any>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap((response) => {
        sessionStorage.setItem('token', response.accessToken);
      })
    );
  }
}
