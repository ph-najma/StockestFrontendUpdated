import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService, IOrder } from '../../services/order.service';
import { UserHeaderComponent } from '../user-header/user-header.component';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { OrderResponse } from '../../interfaces/userInterface';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-order-listing',
  imports: [UserHeaderComponent, FormsModule, NgClass, CommonModule],
  templateUrl: './order-listing.component.html',
  styleUrl: './order-listing.component.css',
})
export class OrderListingComponent implements OnInit, OnDestroy {
  orderData: IOrder[] = [];
  completedOrdersCount: number = 0;
  pendingOrdersCount: number = 0;
  failedOrdersCount: number = 0;
  currentPage: number = 1;
  totalOrders: number = 0;
  totalPages: number = 1;
  limit: number = 10;
  private subcription = new Subscription();
  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchOrderDetails(this.currentPage);
  }

  fetchOrderDetails(page: number): void {
    const OrderDetailsSubscription = this.orderService
      .getOrderByUserId(page, this.limit)
      .subscribe({
        next: (response: OrderResponse) => {
          console.log(response);
          this.orderData = response.data.orders;
          this.totalOrders = response.data.totalOrders;
          this.totalPages = response.data.totalPages;
          this.calculateOrderCounts();
        },
        error: (error) => {
          console.error('Error fetching orders:', error);
        },
      });
    this.subcription.add(OrderDetailsSubscription);
  }
  calculateOrderCounts() {
    this.completedOrdersCount = this.orderData.filter(
      (order) => order.status === 'COMPLETED'
    ).length;
    this.pendingOrdersCount = this.orderData.filter(
      (order) => order.status === 'PENDING'
    ).length;
    this.failedOrdersCount = this.orderData.filter(
      (order) => order.status === 'FAILED'
    ).length;
  }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchOrderDetails(page);
    }
  }
  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }

  itemsPerPage = 10; // or whatever number you prefer
  Math = Math; // Make Math available in template

  // Method to get page numbers for pagination
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  // If you don't already have this method
  // goToPage(page: number): void {
  //   if (page >= 1 && page <= this.totalPages) {
  //     this.currentPage = page;
  //     // Add your pagination logic here
  //     // For example: this.loadOrders();
  //   }
  // }

  // Calculate total pages if not already implemented
  // get totalPages(): number {
  //   return Math.ceil(this.orderData.length / this.itemsPerPage);
  // }
}
