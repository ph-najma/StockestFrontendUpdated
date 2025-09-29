import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment';
import { environment } from '../../environments/environment.prod';
@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket;
  constructor() {
    const token = sessionStorage.getItem('token'); // Or your preferred token storage
    this.socket = io(environment.socketUrl, {
      auth: {
        token: token,
      },
    });
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
    });

    this.socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });
  }

  // Emit request for portfolio updates
  requestPortfolioUpdate(userId: string): void {
    this.socket.emit('requestPortfolioUpdate', userId);
  }
  // Listen for portfolio updates
  onPortfolioUpdate(callback: (portfolio: any) => void): void {
    this.socket.on('portfolioUpdate', callback);
  }

  onStockUpdate(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('stock-update', (data) => {
        observer.next(data);
      });

      // Cleanup
      return () => this.socket.off('stock-update');
    });
  }
  afterFetchUpdate(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('stockUpdate', (data) => {
        observer.next(data);
      });
      return () => this.socket.off('stockUpdate');
    });
  }
  onNotification(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('notification', (data) => observer.next(data));
    });
  }
  emitEvent(event: string, payload: any) {
    this.socket.emit(event, payload);
  }
}
