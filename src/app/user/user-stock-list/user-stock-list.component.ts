import { Component, OnInit, OnDestroy } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { Order } from '../../services/stock.service';
import { UserHeaderComponent } from '../user-header/user-header.component';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from '../search/search.component';
import { Stock } from '../../services/api.service';

interface portfolio {
  quantity: number;
  stockId: Stock;
  _id: string;
}
@Component({
  selector: 'app-user-stock-list',
  imports: [CommonModule, UserHeaderComponent, FormsModule, SearchComponent],
  templateUrl: './user-stock-list.component.html',
  styleUrl: './user-stock-list.component.css',
})
export class UserStockListComponent implements OnInit {
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
  private stockUpdateInterval: NodeJS.Timeout | null = null;

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
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.fetchStocks();
    this.startStockDataUpdates();
    this.fetchUser();
    this.fetchLimits();
  }

  fetchStocks(): void {
    this.apiService.getStocks().subscribe({
      next: (data) => {
        this.stocks = data;
        console.log(data);
      },
      error: (err) => {
        console.error('Error fetching stocks:', err);
      },
    });
  }
  fetchLimits(): void {
    this.apiService.getLimits().subscribe({
      next: (limits) => {
        this.limits = limits;
        console.log('Fetched limits:', limits);
      },
      error: (err) => {
        console.error('Error fetching limits:', err);
      },
    });
  }
  fetchUser(): void {
    this.apiService.getUserProfile().subscribe({
      next: (data) => {
        console.log(data);
        this.userBalance = data.balance;
        this.userPortfolio = data.portfolio;
        console.log(this.userPortfolio, 'portfolio');
      },
    });
  }

  openSellModal(stock: Stock): void {
    console.log(stock, 'from sell modal');
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
        alert(
          `You cannot sell more than ${this.limits.maxSellLimit} units at a time.`
        );
        return;
      }
      console.log(this.userPortfolio, 'user from sell');

      const stockInPortfolio = this.userPortfolio.find(
        (item) => item.stockId.symbol === this.selectedStock?.symbol
      );

      console.log(this.selectedStock.symbol, 'stock id');
      console.log(stockInPortfolio, 'stock in portfolio');
      if (
        !stockInPortfolio ||
        stockInPortfolio.quantity < this.quantityToSell
      ) {
        alert('Not enough stock to sell');
        return;
      }

      const orderData: Order = {
        stock: this.selectedStock.originalId,
        type: 'SELL',
        orderType: this.orderType,
        quantity: this.quantityToSell,
        price: this.sellPrice,
        status: 'PENDING',
      };

      this.stockService.placeOrder(orderData).subscribe({
        next: async () => {
          await this.updatePortfolioAfterSell(stockInPortfolio);

          this.closeSellModal();
          this.fetchStocks();
          alert('Order placed successfully.');
        },
        error: (err) => {
          console.error('Error selling stock:', err);
        },
      });
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

    this.apiService.updateUserPortfolio(updatedPortfolio).subscribe({
      next: (data) => {
        this.fetchUser();
      },
      error: (err) => {
        console.error('Error updating portfolio:', err);
      },
    });
  }

  openBuyModal(stock: Stock): void {
    console.log('heloo');
    this.selectedStock = stock;
    this.isBuyModalOpen = true;
    this.buyPrice = stock.price;
    console.log(this.isBuyModalOpen);
  }

  closeBuyModal(): void {
    this.isBuyModalOpen = false;
    this.selectedStock = null;
    this.quantityToBuy = 1;
    this.buyPrice = 0;
  }
  buyStock(): void {
    if (this.quantityToBuy > 0 && this.selectedStock) {
      const totalCost = this.buyPrice * this.quantityToBuy;

      // Check if the order exceeds limits
      if (this.quantityToBuy > this.limits.maxBuyLimit) {
        alert(
          `You cannot buy more than ${this.limits.maxBuyLimit} units at a time.`
        );
        return;
      }

      if (this.userBalance < totalCost) {
        alert('Insufficient balance to buy stock.');
        return;
      }

      const orderData: Order = {
        stock: this.selectedStock.originalId,
        type: 'BUY',
        orderType: this.orderType,
        quantity: this.quantityToBuy,
        price: this.buyPrice,
        status: 'PENDING',
      };

      this.stockService.placeOrder(orderData).subscribe({
        next: () => {
          this.closeBuyModal();
          this.fetchStocks();
          alert('Order placed successfully.');
        },
        error: (err) => {
          console.error('Error buying stock:', err);
        },
      });
    }
  }
  startStockDataUpdates(): void {
    this.stockUpdateInterval = setInterval(() => {
      this.fetchStocks();
    }, 60000);
  }

  ngOnDestroy(): void {
    if (this.stockUpdateInterval) {
      clearInterval(this.stockUpdateInterval);
    }
  }
}
