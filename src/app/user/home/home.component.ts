import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import {
  PortfolioItem,
  PortfolioResponseModel,
} from '../../interfaces/userInterface';
import { UserHeaderComponent } from '../user-header/user-header.component';
import { SearchComponent } from '../search/search.component';
import { Socket } from 'ngx-socket-io';
import { CommonModule, NgClass } from '@angular/common';
import { AddMoneyComponent } from '../add-money/add-money.component';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-home',
  imports: [
    RouterModule,
    UserHeaderComponent,

    NgClass,
    CommonModule,
    AddMoneyComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnDestroy, OnInit {
  portfolio: PortfolioItem[] = [];
  summary = {
    totalPortfolioValue: 0,
    overallProfit: 0,
    todaysProfit: 0,
    currentValue: 0,
  };
  private subscription = new Subscription();
  constructor(
    private apiService: ApiService,
    private router: Router,
    private socket: Socket
  ) {}
  ngOnInit(): void {
    this.fetchPortfolio();
    this.socket.on('portfolioSummaryUpdate', (data: any) => {
      console.log('connected socket');
      this.updatePortfolioSummary(data);
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  fetchPortfolio(): void {
    const portfolioSubscription = this.apiService.getPortfolio().subscribe(
      (response: PortfolioResponseModel) => {
        if (response.data) {
          console.log(response.data);
          this.portfolio = response.data?.portfolio.map((item: any) => {
            const portfolioItem = item._doc;
            console.log(item.currentValue); // Access the `_doc` object
            return {
              stock: portfolioItem.stockId, // Stock details
              quantity: portfolioItem.quantity, // Extract quantity from `_doc`
              currentValue: item.currentValue, // Access top-level fields
              overallProfit: item.overallProfit,
              todaysProfit: item.todaysProfit,
            };
          });

          const invested = this.portfolio.reduce((acc, item) => {
            const buyPrice = item.stock?.price || 0;
            return acc + item.quantity * buyPrice;
          }, 0);

          // Update the summary
          this.summary.totalPortfolioValue = invested; // ✅ Invested amount
          this.summary.currentValue = response.data.totalPortfolioValue; // ✅ Live value
          this.summary.overallProfit = response.data.overallProfit;
          this.summary.todaysProfit = response.data.todaysProfit;
          console.log('Invested:', this.summary.totalPortfolioValue);
          console.log('Current:', this.summary.currentValue);
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

  logout() {
    this.apiService.logout(); // Call the logout method from ApiService
    this.router.navigate(['/login']); // Redirect to the login page after logout
  }
  profile() {
    this.router.navigate(['/userProfile']);
  }
  addMoneySidebar() {
    this.router.navigate(['/addmoney']);
  }
  isAddMoneyOpen = false;

  // Toggle the sidebar
  toggleAddMoneySidebar() {
    this.isAddMoneyOpen = !this.isAddMoneyOpen;
  }
}
