import { Component, OnInit } from '@angular/core';
import { TransStatisticsComponent } from '../trans-statistics/trans-statistics.component';
import { TransTableComponent } from '../trans-table/trans-table.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { HeaderComponent } from '../header/header.component';

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
  ],
  templateUrl: './trans-main.component.html',
  styleUrl: './trans-main.component.css',
})
export class TransMainComponent implements OnInit {
  constructor(private apiService: ApiService) {}
  transactions: Transaction[] = [];
  ngOnInit(): void {
    this.fetchTransactions();
  }

  fetchTransactions() {
    this.apiService.getAllTrans().subscribe({
      next: (data) => {
        console.log(data);

        this.transactions = data.map((item) => ({
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
  }

  searchTerm: string = '';
  filters = { type: '', status: '', dateRange: { start: null, end: null } };

  get processedTransactions() {
    return this.transactions.filter((transaction) => {
      console.log('transaction type', transaction.type);
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
}
