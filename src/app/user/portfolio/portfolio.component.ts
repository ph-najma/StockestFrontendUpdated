import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserHeaderComponent } from '../user-header/user-header.component';
import { PortfolioItem } from '../../services/api.service';
import { Stock } from '../../services/api.service';
import { Socket } from 'ngx-socket-io';
import { PortfolioResponseModel } from '../../interfaces/userInterface';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-portfolio',
  imports: [CommonModule, UserHeaderComponent],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'], // Fixed typo: `styleUrl` to `styleUrls`
})
export class PortfolioComponent implements OnInit, OnDestroy {
  portfolio: PortfolioItem[] = [];
  summary = {
    totalPortfolioValue: 0,
    overallProfit: 0,
    todaysProfit: 0,
  };
  private subscription = new Subscription();
  selectedStock: Stock | null = null;

  constructor(private apiService: ApiService, private socket: Socket) {}

  ngOnInit(): void {
    this.fetchPortfolio();
    this.socket.on('portfolioSummaryUpdate', (data: any) => {
      console.log('connected socket');
      this.updatePortfolioSummary(data);
    });
  }

  fetchPortfolio(): void {
    const portfolioSubscription = this.apiService.getPortfolio().subscribe(
      (response: PortfolioResponseModel) => {
        if (response.data) {
          this.portfolio = response.data.portfolio.map((item: any) => {
            const portfolioItem = item._doc;
            return {
              stock: portfolioItem.stockId,
              quantity: portfolioItem.quantity,
              currentValue: item.currentValue,
              overallProfit: item.overallProfit,
              todaysProfit: item.todaysProfit,
            };
          });

          // Update the summary
          this.summary.totalPortfolioValue = response.data.totalPortfolioValue;
          this.summary.overallProfit = response.data.overallProfit;
          this.summary.todaysProfit = response.data.todaysProfit;
        }
        // Map the portfolio data to extract relevant fields

        // Debugging logs
        console.log('Mapped Portfolio:', this.portfolio);
      },
      (error) => {
        console.error('Error fetching portfolio data:', error);
      }
    );
    this.subscription.add(portfolioSubscription);
  }
  updatePortfolioSummary(data: any): void {
    this.summary.totalPortfolioValue = data.totalPortfolioValue;
    this.summary.overallProfit = data.overallProfit;
    this.summary.todaysProfit = data.todaysProfit;
    console.log('Live portfolio summary updated:', this.summary);
  }

  selectStock(stock: Stock): void {
    this.selectedStock = stock;
  }

  closeStockDetails(): void {
    this.selectedStock = null;
  }
  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.subscription.unsubscribe();
  }
}
