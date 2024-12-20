import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserHeaderComponent } from '../user-header/user-header.component';
import { ApiService } from '../../services/api.service';
import { Transaction } from '../../services/api.service';
@Component({
  selector: 'app-transaction-history',
  imports: [CommonModule, UserHeaderComponent],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.css',
})
export class TransactionHistoryComponent implements OnInit {
  transactionData: Transaction[] = [];
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchTransactions();
  }

  fetchTransactions(): void {
    this.apiService.getTransactions().subscribe({
      next: (data) => {
        this.transactionData = data;
        console.log(data, 'from transactions');
      },
    });
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
