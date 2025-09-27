import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { StockService, Stock } from '../../services/stock.service';
import { HeaderComponent } from '../header/header.component';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { WebSocketService } from '../../services/web-socket.service';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-stocklist',
  imports: [CommonModule, HeaderComponent, RouterModule, AdminSidebarComponent],
  templateUrl: './stocklist.component.html',
  styleUrl: './stocklist.component.css',
})
export class StocklistComponent implements OnInit, OnDestroy {
  stocks: Stock[] = [];
  currentPage: number = 1;
  totalUsers: number = 0;
  totalPages: number = 1;
  limit: number = 10;
  private unsubscribe$ = new Subject<void>();
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchStocks();
    }
  }
  private susbcription = new Subscription();
  private stockUpdateInterval: NodeJS.Timeout | null = null;

  constructor(
    private stockService: StockService,
    private webSocketService: WebSocketService
  ) {}

  dropdownOpen: string | null = null;

  getStatusClass(status: string): string {
    return status === 'active'
      ? 'bg-green-50 text-green-700 border border-green-200'
      : 'bg-gray-50 text-gray-600 border border-gray-200';
  }

  toggleDropdown(stockId: string): void {
    this.dropdownOpen = this.dropdownOpen === stockId ? null : stockId;
  }

  ngOnInit(): void {
    this.initializeSocketConnection();
    this.fetchStocks();
  }
  initializeSocketConnection(): void {
    this.webSocketService
      .afterFetchUpdate()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((stocks) => {
        console.log('working0');
        this.stocks = stocks;
        console.log(this.stocks);
      });
  }
  fetchStocks(): void {
    const stocklistSubscription = this.stockService.getStocks().subscribe({
      next: (response: any) => {
        this.stocks = response.data;
      },
      error: (err) => {
        console.error('Error fetching stocks:', err);
      },
    });
    this.susbcription.add(stocklistSubscription);
  }

  ngOnDestroy(): void {
    this.susbcription.unsubscribe();
  }
}
