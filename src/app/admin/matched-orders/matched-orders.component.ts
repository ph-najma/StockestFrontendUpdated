import { Component, OnDestroy } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';
import { OrderService, IOrder } from '../../services/order.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-matched-orders',
  imports: [
    HeaderComponent,
    RouterModule,
    CommonModule,
    CurrencyPipe,
    AdminSidebarComponent,
  ],
  templateUrl: './matched-orders.component.html',
  styleUrl: './matched-orders.component.css',
})
export class MatchedOrdersComponent implements OnDestroy {
  orders: IOrder[] = [];
  private subscriptions = new Subscription();
  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    const matchOrderSubscription = this.orderService
      .getMatchedOrders()
      .subscribe(
        (response: any) => {
          this.orders = response.data;
        },
        (error) => {
          console.error('Error fetching matched orders:', error);
        }
      );
    this.subscriptions.add(matchOrderSubscription);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
