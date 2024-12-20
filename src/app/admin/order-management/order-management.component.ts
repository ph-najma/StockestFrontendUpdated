import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { IOrder } from '../../services/order.service';

@Component({
  selector: 'app-order-management',
  imports: [HeaderComponent, RouterModule, CommonModule],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.css',
})
export class OrderManagementComponent implements OnInit {
  orders: IOrder[] = [];
  filteredOrders: IOrder[] = [];
  currentFilter: string = 'PENDING';

  constructor(private orderservice: OrderService) {}
  ngOnInit(): void {
    this.fetchOrders();
  }
  fetchOrders(): void {
    this.orderservice.getOrders().subscribe(
      (data) => {
        this.orders = data;
        console.log(this.orders);
        this.filterOrders(this.currentFilter);

        console.log(data);
      },
      (error) => {
        console.error('Error fetching orders', error);
      }
    );
  }
  filterOrders(status: string): void {
    this.currentFilter = status;
    this.filteredOrders = this.orders.filter(
      (order) => order.status === this.currentFilter
    );
    console.log(`Filtered Orders for status "${status}":`, this.filteredOrders);
  }
}
