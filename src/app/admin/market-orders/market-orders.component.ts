import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { OrderService, IOrder } from '../../services/order.service';
import { FormsModule } from '@angular/forms';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { Subscription } from 'rxjs';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
@Component({
  selector: 'app-market-orders',
  imports: [
    HeaderComponent,
    RouterModule,
    CommonModule,
    CurrencyPipe,
    FormsModule,
    ConfirmationModalComponent,
    AdminSidebarComponent,
  ],
  templateUrl: './market-orders.component.html',
  styleUrl: './market-orders.component.css',
})
export class MarketOrdersComponent implements OnInit, OnDestroy {
  marketOrders: IOrder[] = [];
  allOrders: IOrder[] = []; // Store all orders to apply filters locally
  filteredOrders: IOrder[] = []; // Filtered orders after applying filters
  filters = {
    status: 'all',
    user: '',
    dateRange: '',
  };
  showModal = false;
  selectedOrderId: string | null = null;
  private subscriptions = new Subscription();

  constructor(
    private orderService: OrderService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    const marketOrderSubscription = this.orderService
      .getMarketOrders({})
      .subscribe(
        (response: any) => {
          this.allOrders = response.data;
          this.filteredOrders = [...this.allOrders];
          this.marketOrders = [...this.allOrders];
        },
        (error) => {
          console.error('Error fetching market orders', error);
        }
      );
    this.subscriptions.add(marketOrderSubscription);
  }

  applyFilters(): void {
    this.marketOrders = this.allOrders.filter((order) => {
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
          const orderIndex = this.marketOrders.findIndex(
            (order) => order._id === this.selectedOrderId
          );
          if (orderIndex !== -1) {
            this.marketOrders = [
              ...this.marketOrders.slice(0, orderIndex),
              { ...this.marketOrders[orderIndex], status: 'FAILED' },
              ...this.marketOrders.slice(orderIndex + 1),
            ];
            this.cdRef.detectChanges();
          }
          this.selectedOrderId = null;
        });
      this.subscriptions.add(cancelOrderSubscription);
    }
    this.showModal = false;
  }

  handleCancel(): void {
    this.selectedOrderId = null;
    this.showModal = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
