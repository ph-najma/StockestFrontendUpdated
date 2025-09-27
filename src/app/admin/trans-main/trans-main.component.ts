import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransStatisticsComponent } from '../trans-statistics/trans-statistics.component';
import { TransTableComponent } from '../trans-table/trans-table.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';

export interface Transaction {
  id: string;
  user: string;
  type: string;
  stock: { symbol: string };
  quantity: number;
  price: number;
  total: number;
  date: Date;
  status: string;
  buyer: { name: string };
  seller: { name: string };
}

@Component({
  selector: 'app-trans-main',
  imports: [
    TransStatisticsComponent,
    TransTableComponent,
    CommonModule,
    FormsModule,
    HeaderComponent,
    RouterModule,
    AdminSidebarComponent,
  ],
  templateUrl: './trans-main.component.html',
  styleUrl: './trans-main.component.css',
})
export class TransMainComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  constructor(private apiService: ApiService) {}
  transactions: Transaction[] = [];
  ngOnInit(): void {
    this.fetchTransactions();
  }
  currentPage: number = 1;
  totalUsers: number = 0;
  totalPages: number = 1;
  limit: number = 10;

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchTransactions();
    }
  }

  fetchTransactions() {
    const getTransactionSubscription = this.apiService.getAllTrans().subscribe({
      next: (response: any) => {
        console.log(response);

        this.transactions = response.data.map((item: any) => ({
          id: item._id,
          user: item.user,
          buyer: { name: item.buyer?.name ?? 'N/A' },
          seller: { name: item.seller?.name ?? 'N/A' },
          type: item.type,
          stock: { symbol: item.stock?.symbol ?? 'N/A' },
          quantity: item.quantity,
          price: item.price,
          total: item.totalAmount,
          date: new Date(item.createdAt),
          status: item.status,
        }));

        console.log(this.transactions, 'these are transactions');
      },
      error: (err) => {
        console.error('Error fetching transactions', err);
      },
    });
    this.subscription.add(getTransactionSubscription);
  }

  searchTerm: string = '';
  filters = { type: '', status: '', dateRange: { start: null, end: null } };

  get processedTransactions() {
    return this.transactions.filter((transaction) => {
      const matchesType =
        !this.filters.type || transaction.type === this.filters.type;
      const matchesStatus =
        !this.filters.status || transaction.status === this.filters.status;
      const matchesSearch =
        !this.searchTerm ||
        transaction.user
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        transaction.stock.symbol
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        transaction.id.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesType && matchesStatus && matchesSearch;
    });
  }

  get transactionStats() {
    const processed = this.processedTransactions;
    return {
      total: processed.length,
      totalVolume: processed.reduce((sum, t) => sum + t.total, 0),
      buyTransactions: processed.filter(
        (t) => t.type?.trim().toLowerCase() === 'buy'
      ).length,
      sellTransactions: processed.filter(
        (t) => t.type?.trim().toLowerCase() === 'sell'
      ).length,
    };
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
