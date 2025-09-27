import { Component, OnInit, OnDestroy } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { ApiService, IWatchlist, User } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { Order } from '../../services/stock.service';
import { UserHeaderComponent } from '../user-header/user-header.component';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from '../search/search.component';
import { Stock } from '../../services/api.service';
import { Router } from '@angular/router';
import { WebSocketService } from '../../services/web-socket.service';
import { Subscription, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AlertService } from '../../services/alert.service';
import { ResponseModel } from '../../interfaces/userInterface';
import { takeUntil } from 'rxjs/operators';
interface portfolio {
  quantity: number;
  stockId: Stock;
  _id: string;
  isIntraday: Boolean;
}
@Component({
  selector: 'app-user-stock-list',
  imports: [CommonModule, UserHeaderComponent, FormsModule],
  templateUrl: './user-stock-list.component.html',
  styleUrl: './user-stock-list.component.css',
})
export class UserStockListComponent implements OnInit, OnDestroy {
  private socket!: Socket;
  private unsubscribe$ = new Subject<void>();
  stocks: Stock[] = [];
  isSellModalOpen = false;
  isBuyModalOpen = false;
  selectedStock: any = null;
  quantityToSell: number = 1;
  quantityToBuy: number = 1;
  buyPrice: number = 0;
  sellPrice: number = 0;
  orderType: 'MARKET' | 'LIMIT' | 'STOP' = 'MARKET';
  userPortfolio: portfolio[] = [];
  userBalance: number = 0;
  isIntraday: boolean = false;
  currentUser: User | null = null;

  private subscriptions = new Subscription();
  limits: {
    maxBuyLimit: number;
    maxSellLimit: number;
    timeframeInHours: number;
  } = {
    maxBuyLimit: 1000,
    maxSellLimit: 500,
    timeframeInHours: 24,
  };
  constructor(
    private stockService: StockService,
    private apiService: ApiService,
    private router: Router,
    private alertService: AlertService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.initializeSocketConnection();
    this.loadInitialData();
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
  loadInitialData(): void {
    this.apiService
      .getInitialData()
      .then(({ stocks, user }) => {
        this.stocks = stocks;
        this.userBalance = user.balance;
        this.userPortfolio = user.portfolio;
        this.currentUser = user;
      })
      .catch((error) =>
        this.alertService.showAlert('Error loading initial data')
      );
  }

  // private async loadInitialData(): Promise<void> {
  //   try {
  //     // Fetch stocks, user data, and limits concurrently
  //     const [stocksResponse, userResponse] = await Promise.all([
  //       this.apiService.getStocks().toPromise(),
  //       this.apiService.getUserProfile().toPromise(),
  //       // this.apiService.getLimits().toPromise(),
  //     ]);

  //     // Assign fetched data to component properties
  //     this.stocks = stocksResponse?.data || [];
  //     this.userBalance = userResponse?.data.balance || 0;
  //     this.userPortfolio = userResponse?.data.portfolio || [];
  //     this.currentUser = userResponse?.data || null;
  //     // this.limits = limitsResponse || this.limits;

  //     // if (limitsResponse) {
  //     //   this.limits = limitsResponse || this.limits;
  //     // } else {
  //     //   console.warn('Limits response is undefined.');
  //     // }
  //   } catch (error) {
  //     throw new Error('Failed to load initial data');
  //   }
  // }

  openSellModal(stock: Stock): void {
    this.selectedStock = stock;
    this.isSellModalOpen = true;
    this.sellPrice = stock.price;
    this.quantityToSell = 1;
  }

  closeSellModal(): void {
    this.isSellModalOpen = false;
    this.selectedStock = null;
  }

  sellStock(): void {
    if (this.quantityToSell > 0 && this.selectedStock) {
      if (this.quantityToSell > this.limits.maxSellLimit) {
        this.alertService.showAlert(
          `You cannot sell more than ${this.limits.maxSellLimit} units at a time.`
        );
        return;
      }

      const stockInPortfolio = this.userPortfolio.find(
        (item) => item.stockId.symbol === this.selectedStock?.symbol
      );

      if (
        !stockInPortfolio ||
        stockInPortfolio.quantity < this.quantityToSell
      ) {
        this.alertService.showAlert('Not enough stock to sell');
        return;
      }

      console.log(this.selectedStock.originalId);

      const orderData: Order = {
        stock: this.selectedStock.originalId,
        type: 'SELL',
        orderType: this.orderType,
        quantity: this.quantityToSell,
        price: this.sellPrice,
        status: 'PENDING',
      };

      this.stockService
        .placeOrder(orderData)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          () => {
            this.alertService.showAlert('Sell order placed successfully.');
            this.closeSellModal();
          },
          (error) => this.alertService.showAlert('Error placing sell order.')
        );
    }
  }

  async updatePortfolioAfterSell(stockInPortfolio: portfolio): Promise<void> {
    const updatedPortfolio = this.userPortfolio
      .map((item) => {
        if (item.stockId.symbol === this.selectedStock.symbol) {
          if (item.quantity === this.quantityToSell) {
            return null;
          } else {
            item.quantity -= this.quantityToSell;
          }
        }
        return item;
      })
      .filter((item) => item !== null);

    const updatedPortfoliosubscription = this.apiService
      .updateUserPortfolio(updatedPortfolio)
      .subscribe({
        next: (data) => {},
        error: (err) => {
          console.error('Error updating portfolio:', err);
        },
      });
    this.subscriptions.add(updatedPortfoliosubscription);
  }

  openBuyModal(stock: Stock): void {
    this.selectedStock = stock;
    this.isBuyModalOpen = true;
    this.buyPrice = stock.price;
  }
  changeStatus() {
    this.isIntraday = true;
  }

  closeBuyModal(): void {
    this.isBuyModalOpen = false;
    this.selectedStock = null;
    this.quantityToBuy = 1;
    this.buyPrice = 0;
    this.isIntraday = false;
  }
  buyStock(): void {
    console.log(this.selectedStock._id);

    if (this.quantityToBuy > 0 && this.selectedStock) {
      const totalCost = this.buyPrice * this.quantityToBuy;

      if (this.quantityToBuy > this.limits.maxBuyLimit) {
        this.alertService.showAlert(
          `You cannot buy more than ${this.limits.maxBuyLimit} units at a time.`
        );
        return;
      }

      if (this.isIntraday) {
        const leverage = 5;
        const requiredMargin = totalCost / leverage;

        if (this.userBalance < requiredMargin) {
          this.alertService.showAlert(
            `Insufficient margin. Required: $${requiredMargin.toFixed(
              2
            )}, Available: $${this.userBalance.toFixed(2)}`
          );
          return;
        }
      } else if (this.userBalance < totalCost) {
        this.alertService.showAlert('Insufficient balance to buy stock.');
        return;
      }

      const orderData: Order = {
        stock: this.selectedStock._id,
        type: 'BUY',
        orderType: this.orderType,
        quantity: this.quantityToBuy,
        price: this.buyPrice,
        status: 'PENDING',
        isIntraday: this.isIntraday,
      };

      const placeOrderSubscription = this.stockService
        .placeOrder(orderData)
        .subscribe({
          next: () => {
            this.closeBuyModal();

            this.alertService.showAlert('Order placed successfully.');
          },
          error: (err) => {
            console.error('Error buying stock:', err);
          },
        });
      this.subscriptions.add(placeOrderSubscription);
    }
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.subscriptions.unsubscribe();
  }
  dropdownStates = new Map();

  toggleDropdown(stock: Stock) {
    const currentState = this.dropdownStates.get(stock.symbol) || false;
    this.dropdownStates.set(stock.symbol, !currentState);
  }

  isDropdownOpen(stock: Stock): boolean {
    return this.dropdownStates.get(stock.symbol) || false;
  }

  addToStockList(stock: Stock) {
    this.selectedStock = stock;
    console.log(this.selectedStock.originalId);
    const watchlist: IWatchlist = {
      user: this.currentUser,
      stocks: [
        {
          stockId: this.selectedStock.symbol,
          addedAt: new Date(),
        },
      ],
      name: 'My Watchlist',
      createdAt: new Date(),
    };
    const stockSymbols = stock.symbol;

    this.apiService.addToWatchlist(watchlist).subscribe({
      next: () => {
        this.alertService.showAlert(
          `${stockSymbols} has been added to your stock list.`
        );
      },
    });

    this.dropdownStates.set(stockSymbols, false);
  }
  tradingview(stock: Stock) {
    const symbol = stock.symbol;
    this.router.navigate(['/tradingview'], { queryParams: { symbol: symbol } });
  }
}
