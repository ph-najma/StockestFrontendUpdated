import { Component, OnInit, OnDestroy } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { IOrder } from '../../services/order.service';
import { Subscription } from 'rxjs';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-order-management',
  imports: [HeaderComponent, RouterModule, CommonModule, AdminSidebarComponent],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.css',
})
export class OrderManagementComponent implements OnInit, OnDestroy {
  orders: IOrder[] = [];
  filteredOrders: IOrder[] = [];
  currentFilter: string = 'PENDING';
  private subscription = new Subscription();

  constructor(private orderservice: OrderService) {}
  ngOnInit(): void {
    this.fetchOrders();
  }
  fetchOrders(): void {
    const getOrderSubscription = this.orderservice.getOrders().subscribe(
      (response) => {
        this.orders = response.data;
        console.log(this.orders);
        this.filterOrders(this.currentFilter);
      },
      (error) => {
        console.error('Error fetching orders', error);
      }
    );
    this.subscription.add(getOrderSubscription);
  }
  filterOrders(status: string): void {
    this.currentFilter = status;
    this.filteredOrders = this.orders.filter(
      (order) => order.status === this.currentFilter
    );
    console.log(`Filtered Orders for status "${status}":`, this.filteredOrders);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
