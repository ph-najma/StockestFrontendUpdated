import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
export interface Stock {
  _id: string;
  symbol: string;
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  price: number;
  change: number;
  changePercent: string;
  latestTradingDay: string;
}
export interface Order {
  stock: Stock;
  type: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT' | 'STOP';
  quantity: number;
  price: number; // This is the price for Limit orders
  stopPrice?: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  isIntraday?: boolean; // Only for STOP orders
}

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    console.log(token);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`, // Set the token in the Authorization header
    });
  }
  getStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/stocklist`, {
      headers: this.getAuthHeaders(),
    });
  }
  updateStock(id: string, stock: Stock): Observable<Stock> {
    console.log(id, stock, 'from service');
    return this.http.put<Stock>(`${this.apiUrl}/editStock/${id}`, stock);
  }

  deleteStock(id: string | undefined): Observable<Stock> {
    return this.http.put<Stock>(`${this.apiUrl}/softDeleteStock/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
  displayStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/dispalyStocks`);
  }
  placeOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/orders`, order, {
      headers: this.getAuthHeaders(),
    });
  }
  placeBuyOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/orders`, order);
  }
  checkPortfolio(order: any): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/checkPortfolio`, order);
  }
  getUserMargins(): Observable<{
    availableMargin: number;
    requiredMargin: number;
  }> {
    return this.http.get<{ availableMargin: number; requiredMargin: number }>(
      `${this.apiUrl}/margins`
    );
  }
  getStockData(symbol: string | undefined): Observable<any> {
    return this.http.get(`${this.apiUrl}/getStockData?symbol=${symbol}`, {
      headers: this.getAuthHeaders(),
    });
  }
  getHistroical(symbol: string | undefined): Observable<any> {
    return this.http.get(`${this.apiUrl}/gethistorical?symbol=${symbol}`, {
      headers: this.getAuthHeaders(),
    });
  }
  getTransactions(symbol: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/transactions`, {
      headers: this.getAuthHeaders(),
    });
  }
  getNewFetched(symbol: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/angelStocks/${symbol}`);
  }
}
