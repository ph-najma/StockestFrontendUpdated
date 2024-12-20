import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { ApiService } from '../../services/api.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-transactions',
  imports: [DatePipe, FormsModule, HeaderComponent, CommonModule, RouterModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent implements OnInit {
  constructor(private apiService: ApiService) {}
  feeStructure = {
    standardCommissionRate: 1,
    flatTransactionFee: 5.0,
    volumeDiscounts: [{ minVolume: 100, maxVolume: 500, discountRate: 0.02 }],
  };
  // Promotions data
  promotions = [
    {
      id: 1,
      name: 'New Trader Discount',
      type: 'Percentage Reduction',
      discountValue: 20,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
  ];
  // Fee collection summary data
  feeSummary = {
    totalFeesCollected: 12345.67,
    periodStart: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    periodEnd: new Date(),
  };

  ngOnInit(): void {
    this.getFees();
  }
  getFees() {
    this.apiService.getTotalFees().subscribe({
      next: (data) => {
        this.feeSummary.totalFeesCollected = data;
        console.log(data);
        console.log(this.feeSummary);
      },
    });
  }
  generateReport() {}
  addPromotion() {}
}
