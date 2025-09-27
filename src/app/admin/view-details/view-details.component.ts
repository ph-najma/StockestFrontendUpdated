import { Component, OnInit, OnDestroy } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import {
  OrderService,
  IOrder,
  ITransaction,
} from '../../services/order.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
@Component({
  selector: 'app-view-details',
  imports: [HeaderComponent, CommonModule, RouterModule, AdminSidebarComponent],
  templateUrl: './view-details.component.html',
  styleUrl: './view-details.component.css',
})
export class ViewDetailsComponent implements OnInit, OnDestroy {
  orderDetails: IOrder | null = null;
  transactions: ITransaction[] = [];
  private susbcription = new Subscription();
  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}
  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.getOrderDetails(orderId);
    }
  }
  getOrderDetails(orderId: string): void {
    const OrderSubscription = this.orderService
      .getOrderById(orderId)
      .subscribe((res: any) => {
        console.log(res);
        if (res.data.order) {
          this.orderDetails = res.data.order;
        }
        console.log(this.orderDetails);
        this.transactions = res.transactions;
      });
    this.susbcription.add(OrderSubscription);
  }
  ngOnDestroy(): void {
    this.susbcription.unsubscribe();
  }
}
