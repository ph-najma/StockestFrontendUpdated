import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService, Stock } from '../../services/api.service';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { WebSocketService } from '../../services/web-socket.service';
import {
  faStar,
  faArrowUp,
  faArrowDown,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';
import { UserHeaderComponent } from '../user-header/user-header.component';
import { RouterModule } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { AlertService } from '../../services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-watchlist',
  imports: [CommonModule, UserHeaderComponent, FontAwesomeModule, RouterModule],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css',
})
export class WatchlistComponent implements OnInit, OnDestroy {
  stocks: any[] = [];
  private socket!: Socket;
  private stockUpdateInterval: NodeJS.Timeout | null = null;
  private subscriptions = new Subscription();
  constructor(
    private apiService: ApiService,
    private faIconLibrary: FaIconLibrary,
    private socketService: WebSocketService,
    private alertService: AlertService
  ) {
    this.faIconLibrary.addIcons(
      faStar,
      faArrowUp,
      faArrowDown,
      faEllipsisVertical
    );
  }
  initializeSocketConnection(): void {
    this.socket = io('http://localhost:5000');

    this.socket.on('stockUpdate', (data: Stock[]) => {
      // Only update stocks that exist in the current watchlist
      this.stocks = this.stocks.map((stock) => {
        const updatedStock = data.find(
          (update) => update.symbol === stock.symbol
        );
        return updatedStock ? { ...stock, ...updatedStock } : stock;
      });
    });
  }

  ngOnInit(): void {
    this.fetchWatchlist();
    this.listenForStockUpdates();
    this.listenForNotifications();
    this.initializeSocketConnection();
  }

  fetchWatchlist(): void {
    const watchlistSubscription = this.apiService.getWatchlist().subscribe({
      next: (response: any) => {
        this.stocks = response.data.stocks.filter(
          (stock: any) => stock._id && stock.symbol
        );
      },
      error: (err) => {
        console.error('Error fetching watchlist:', err);
        this.alertService.showAlert('Error fetching watchlist');
      },
    });
    this.subscriptions.add(watchlistSubscription);
  }

  listenForStockUpdates() {
    const stockUpdatesubsription = this.socketService
      .onStockUpdate()
      .subscribe((update: any) => {
        const stockIndex = this.stocks.findIndex(
          (stock) => stock.stockId === update.stockId
        );

        if (stockIndex !== -1) {
          // Update the existing stock
          this.stocks[stockIndex] = { ...this.stocks[stockIndex], ...update };
        } else {
          this.alertService.showAlert(
            'Stock not found in watchlist for update:'
          );
        }
      });
    this.subscriptions.add(stockUpdatesubsription);
  }
  fetchupdates() {
    const afterFetchUpdateSubsription = this.socketService
      .afterFetchUpdate()
      .subscribe((update: any) => {
        const stockIndex = this.stocks.findIndex(
          (stock) => stock.stockId === update.stockId
        );
        if (stockIndex !== -1) {
          this.stocks[stockIndex] = { ...this.stocks[stockIndex], ...update };
        } else {
          this.alertService.showAlert(
            'Stock not found in watchlist for update:'
          );
        }
      });
    this.subscriptions.add(afterFetchUpdateSubsription);
  }
  listenForNotifications() {
    const notificationSubsription = this.socketService
      .onNotification()
      .subscribe((notification: any) => {
        this.alertService.showAlert(notification.message);
      });
    this.subscriptions.add(notificationSubsription);
  }
  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.subscriptions.unsubscribe();
  }
}
