import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserHeaderComponent } from '../user-header/user-header.component';
import { ApiService, TransactionDto } from '../../services/api.service';
import { ResponseModel } from '../../interfaces/userInterface';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-transaction-history',
  imports: [CommonModule, UserHeaderComponent],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.css',
})
export class TransactionHistoryComponent implements OnInit {
  transactionData: TransactionDto[] = [];
  private subscriptions = new Subscription();
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchTransactions();
  }

  fetchTransactions(): void {
    const transactionSubscription = this.apiService
      .getTransactions()
      .subscribe({
        next: (response: ResponseModel<TransactionDto[]>) => {
          if (response.data) {
            this.transactionData = response.data;
          }
        },
      });
    this.subscriptions.add(transactionSubscription);
  }

  columnVisibility: Record<
    'id' | 'companyName' | 'shares' | 'total' | 'status',
    boolean
  > = {
    id: false,
    companyName: true,
    shares: true,
    total: true,
    status: true,
  };

  isColumnDropdownOpen = false;

  toggleColumnDropdown(): void {
    this.isColumnDropdownOpen = !this.isColumnDropdownOpen;
  }

  getColumnKeys(): Array<keyof typeof this.columnVisibility> {
    return Object.keys(this.columnVisibility) as Array<
      keyof typeof this.columnVisibility
    >;
  }

  toggleColumnVisibility(column: keyof typeof this.columnVisibility): void {
    this.columnVisibility[column] = !this.columnVisibility[column];
  }
}
