import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { OrderService, IOrder } from '../../services/order.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-market-orders',
  imports: [
    HeaderComponent,
    RouterModule,
    CommonModule,
    CurrencyPipe,
    FormsModule,
  ],
  templateUrl: './market-orders.component.html',
  styleUrl: './market-orders.component.css',
})
export class MarketOrdersComponent implements OnInit {
  marketOrders: IOrder[] = [];
  filters = {
    status: 'all',
    user: '',
    dateRange: '',
  };

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchOrders(); // Initially fetch orders when component loads
  }

  fetchOrders(): void {
    const queryParams: any = {};

    // Add filters to the queryParams if they are set
    if (this.filters.status && this.filters.status !== 'all') {
      queryParams.status = this.filters.status;
    }
    if (this.filters.user) {
      queryParams.user = this.filters.user;
    }
    if (this.filters.dateRange) {
      queryParams.dateRange = this.filters.dateRange;
    }

    // Call the service to fetch the market orders based on queryParams
    this.orderService.getMarketOrders(queryParams).subscribe(
      (orders: IOrder[]) => {
        this.marketOrders = orders; // Update the marketOrders array
        console.log(orders); // Log orders to see the result
      },
      (error) => {
        console.error('Error fetching market orders', error); // Handle error
      }
    );
  }

  applyFilters(): void {
    this.fetchOrders(); // Re-fetch orders when filters are applied
  }

  cancelOrder(orderId: string): void {
    this.orderService.cancelOrder(orderId).subscribe((data) => {
      if (data) {
        this.fetchOrders(); // Re-fetch orders after cancelling an order
      }
    });
  }
}
