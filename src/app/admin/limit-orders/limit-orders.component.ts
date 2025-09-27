import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';
import { OrderService, IOrder } from '../../services/order.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-limit-orders',
  imports: [
    HeaderComponent,
    RouterModule,
    CurrencyPipe,
    CommonModule,
    FormsModule,
    AdminSidebarComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './limit-orders.component.html',
  styleUrl: './limit-orders.component.css',
})
export class LimitOrdersComponent implements OnInit, OnDestroy {
  orders: IOrder[] = [];
  allOrders: IOrder[] = [];
  filteredOrders: IOrder[] = [];
  filters = {
    status: 'all',
    user: '',
    dateRange: '',
  };
  showModal = false;
  selectedOrderId: string | null = null;
  private subscription = new Subscription();
  ngOnInit(): void {
    this.fetchOrders();
  }

  constructor(
    private orderService: OrderService,
    private cdRef: ChangeDetectorRef
  ) {}
  fetchOrders(): void {
    const marketOrderSubscription = this.orderService
      .getMarketOrders({})
      .subscribe(
        (response: any) => {
          this.allOrders = response.data;
          this.filteredOrders = [...this.allOrders];
          this.orders = [...this.allOrders];
        },
        (error) => {
          console.error('Error fetching market orders', error);
        }
      );
    this.subscription.add(marketOrderSubscription);
  }

  applyFilters(): void {
    this.orders = this.allOrders.filter((order) => {
      const matchesStatus =
        this.filters.status === 'all' || order.status === this.filters.status;
      const matchesUser =
        !this.filters.user ||
        order.user.name.toLowerCase().includes(this.filters.user.toLowerCase());
      const matchesDateRange =
        !this.filters.dateRange ||
        new Date(order.createdAt).toLocaleDateString() ===
          new Date(this.filters.dateRange).toLocaleDateString();
      return matchesStatus && matchesUser && matchesDateRange;
    });
  }
  confirmCancel(orderId: string): void {
    this.selectedOrderId = orderId;
    this.showModal = true;
  }

  handleConfirm(): void {
    if (this.selectedOrderId) {
      const cancelOrderSubscription = this.orderService
        .cancelOrder(this.selectedOrderId)
        .subscribe(() => {
          const orderIndex = this.orders.findIndex(
            (order) => order._id === this.selectedOrderId
          );
          if (orderIndex !== -1) {
            this.orders = [
              ...this.orders.slice(0, orderIndex),
              { ...this.orders[orderIndex], status: 'FAILED' },
              ...this.orders.slice(orderIndex + 1),
            ];
            this.cdRef.detectChanges();
          }
          this.selectedOrderId = null;
        });
      this.subscription.add(cancelOrderSubscription);
    }
    this.showModal = false;
  }
  handleCancel(): void {
    this.selectedOrderId = null;
    this.showModal = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
