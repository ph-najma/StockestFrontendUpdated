import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserHeaderComponent } from '../user-header/user-header.component';
import { ApiService, TransactionDto, Stock } from '../../services/api.service';
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
            console.log(response.data);
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

  // Helpers to avoid strict template union type errors
  getSymbol(tx: TransactionDto): string {
    const s = tx.stock as string | Stock | undefined;
    return typeof s === 'string' ? s : s?.symbol ?? '';
  }

  getInitial(tx: TransactionDto): string {
    const sym = this.getSymbol(tx);
    return sym ? sym.charAt(0) : '';
  }

  getTotal(tx: TransactionDto): number {
    if (typeof tx.amount === 'number') return tx.amount;
    const price = tx.price ?? 0;
    const qty = tx.quantity ?? 0;
    return price * qty;
  }
}
