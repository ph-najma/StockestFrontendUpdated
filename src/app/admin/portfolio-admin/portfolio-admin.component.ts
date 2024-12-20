import { Component, OnInit } from '@angular/core';
import { PortfolioHoldingsComponent } from '../portfolio-holdings/portfolio-holdings.component';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ApiService,
  PortfolioItem,
  PortfolioResponse,
} from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-portfolio-admin',
  imports: [
    PortfolioHoldingsComponent,
    CommonModule,
    FormsModule,
    UpperCasePipe,
    HeaderComponent,
  ],
  templateUrl: './portfolio-admin.component.html',
  styleUrl: './portfolio-admin.component.css',
})
export class PortfolioAdminComponent implements OnInit {
  userId: string | null = null;
  userPortfolioData: PortfolioResponse | null = null;
  totalPortfolioValue: number = 0;
  constructor(private apiService: ApiService, private route: ActivatedRoute) {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('userId');
      console.log('User ID:', this.userId);
      // You can now fetch the portfolio details using this userId
    });
  }
  ngOnInit(): void {
    this.fetchPortfolio();
  }

  fetchPortfolio(): void {
    if (this.userId) {
      this.apiService.getUserPortfolio(this.userId).subscribe({
        next: (data: PortfolioResponse) => {
          console.log('Fetched Portfolio Data:', data);
          this.userPortfolioData = data;
          this.userPortfolioData.portfolio =
            this.userPortfolioData.portfolio || []; // Ensuring it is always an array
          this.userPortfolioData.portfolio.forEach((holding: PortfolioItem) => {
            holding.currentValue = holding.quantity * holding.stock.price;
          });
          this.totalPortfolioValue = this.userPortfolioData.portfolio.reduce(
            (total: number, holding: PortfolioItem) =>
              total + (holding.currentValue || 0),
            0
          );
        },
        error: (err) => {
          console.error('Error fetching portfolio data:', err);
        },
      });
    }
  }

  activeView: string = 'holdings';

  setActiveView(view: string) {
    this.activeView = view;
  }
}
