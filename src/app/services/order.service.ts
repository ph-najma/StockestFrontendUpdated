import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Stock } from './api.service';

export interface IOrder {
  _id: string;
  user: User;
  stock: Stock;
  type: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT' | 'STOP';
  quantity: number;
  price: number;
  stopPrice?: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: Date;
  completedAt?: Date;
}
export interface ITransaction {
  _id: string;
  buyer: User;
  seller: User;
  buyOrder: IOrder;
  sellOrder: IOrder;
  stock: Stock;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  totalAmount: number;
  fees: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  paymentMethod?: 'PAYPAL' | 'CREDIT_CARD' | 'BANK_TRANSFER';
  paymentReference?: string;
  createdAt: Date;
  completedAt?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:5000';
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    console.log(token);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`, // Set the token in the Authorization header
    });
  }

  getOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders`, {
      headers: this.getAuthHeaders(),
    });
  }
  getLimitOrders(filters: {
    status?: string;
    user?: string;
    dateRange?: string;
  }): Observable<IOrder[]> {
    let params = new HttpParams();

    if (filters.status) {
      params = params.set('status', filters.status);
    }
    if (filters.user) {
      params = params.set('user', filters.user);
    }
    if (filters.dateRange) {
      params = params.set('dateRange', filters.dateRange);
    }
    return this.http.get<IOrder[]>(`${this.apiUrl}/limitorders`, {
      params,
      headers: this.getAuthHeaders(),
    });
  }
  getMarketOrders(filters: {
    status?: string;
    user?: string;
    dateRange?: string;
  }): Observable<IOrder[]> {
    let params = new HttpParams();

    if (filters.status) {
      params = params.set('status', filters.status);
    }
    if (filters.user) {
      params = params.set('user', filters.user);
    }
    if (filters.dateRange) {
      params = params.set('dateRange', filters.dateRange);
    }

    // Add query params to the API call
    return this.http.get<IOrder[]>(`${this.apiUrl}/marketorders`, {
      params,
      headers: this.getAuthHeaders(),
    });
  }

  getMatchedOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${this.apiUrl}/matchedorders`);
  }
  getOrderById(
    orderId: string
  ): Observable<{ order: IOrder; transactions: ITransaction[] }> {
    return this.http.get<{ order: IOrder; transactions: ITransaction[] }>(
      `${this.apiUrl}/orderDetails/${orderId}`,
      { headers: this.getAuthHeaders() }
    );
  }
  cancelOrder(orderId: string): Observable<any> {
    console.log('hello from order service');
    return this.http.post<any>(`${this.apiUrl}/changeStatus/${orderId}`, {
      headers: this.getAuthHeaders(),
    }); // Add an empty object as the body
  }
}
