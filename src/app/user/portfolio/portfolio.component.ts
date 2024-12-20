import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserHeaderComponent } from '../user-header/user-header.component';
import { PortfolioItem, PortfolioResponse } from '../../services/api.service';
import { Stock } from '../../services/api.service';

@Component({
  selector: 'app-portfolio',
  imports: [CommonModule, UserHeaderComponent],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'], // Fixed typo: `styleUrl` to `styleUrls`
})
export class PortfolioComponent implements OnInit {
  portfolio: PortfolioItem[] = [];
  summary = {
    totalPortfolioValue: 0,
    overallProfit: 0,
    todaysProfit: 0,
  };
  selectedStock: Stock | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchPortfolio();
  }

  fetchPortfolio(): void {
    this.apiService.getPortfolio().subscribe(
      (data: PortfolioResponse) => {
        // Map the portfolio data to extract relevant fields
        this.portfolio = data.portfolio.map((item: any) => {
          const portfolioItem = item._doc; // Access the `_doc` object
          return {
            stock: portfolioItem.stockId, // Stock details
            quantity: portfolioItem.quantity, // Extract quantity from `_doc`
            currentValue: item.currentValue, // Access top-level fields
            overallProfit: item.overallProfit,
            todaysProfit: item.todaysProfit,
          };
        });

        // Update the summary
        this.summary.totalPortfolioValue = data.totalPortfolioValue;
        this.summary.overallProfit = data.overallProfit;
        this.summary.todaysProfit = data.todaysProfit;

        // Debugging logs
        console.log('Mapped Portfolio:', this.portfolio);
      },
      (error) => {
        console.error('Error fetching portfolio data:', error);
      }
    );
  }

  selectStock(stock: Stock): void {
    this.selectedStock = stock;
  }

  closeStockDetails(): void {
    this.selectedStock = null;
  }
}
