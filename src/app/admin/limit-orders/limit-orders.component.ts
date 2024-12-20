import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';
import { OrderService, IOrder } from '../../services/order.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-limit-orders',
  imports: [
    HeaderComponent,
    RouterModule,
    CurrencyPipe,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './limit-orders.component.html',
  styleUrl: './limit-orders.component.css',
})
export class LimitOrdersComponent implements OnInit {
  orders: IOrder[] = [];
  filters = {
    status: 'all',
    user: '',
    dateRange: '',
  };
  ngOnInit(): void {
    this.fetchOrders();
  }

  constructor(private orderService: OrderService) {}
  fetchOrders(): void {
    const queryParams: any = {};

    if (this.filters.status && this.filters.status !== 'all') {
      queryParams.status = this.filters.status;
    }
    if (this.filters.user) {
      queryParams.user = this.filters.user;
    }
    if (this.filters.dateRange) {
      queryParams.dateRange = this.filters.dateRange;
    }

    this.orderService.getLimitOrders(queryParams).subscribe(
      (data: IOrder[]) => {
        this.orders = data;
        console.log(data); // Log the result to see if the filtering works
      },
      (error) => {
        console.error('Error fetching orders', error);
      }
    );
  }

  applyFilters(): void {
    this.fetchOrders();
  }
  cancelOrder(orderId: string) {
    this.orderService.cancelOrder(orderId).subscribe((data) => {
      if (data) {
        this.fetchOrders();
      }
    });
  }
}
