import { Component, OnInit, OnDestroy } from '@angular/core';
import { PortfolioHoldingsComponent } from '../portfolio-holdings/portfolio-holdings.component';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  ApiService,
  PortfolioItem,
  PortfolioResponse,
} from '../../services/api.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-portfolio-admin',
  imports: [
    PortfolioHoldingsComponent,
    CommonModule,
    FormsModule,
    UpperCasePipe,
    HeaderComponent,
    RouterModule,
    AdminSidebarComponent,
  ],
  templateUrl: './portfolio-admin.component.html',
  styleUrl: './portfolio-admin.component.css',
})
export class PortfolioAdminComponent implements OnInit, OnDestroy {
  userId: string | null = null;
  userPortfolioData: PortfolioResponse | null = null;
  totalPortfolioValue: number = 0;
  private subscription = new Subscription();
  constructor(private apiService: ApiService, private route: ActivatedRoute) {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('userId');
    });
  }
  ngOnInit(): void {
    this.fetchPortfolio();
  }

  fetchPortfolio(): void {
    if (this.userId) {
      const portfolioSubscription = this.apiService
        .getUserPortfolio(this.userId)
        .subscribe({
          next: (response: any) => {
            console.log('Fetched Portfolio Data:', response);
            this.userPortfolioData = response.data;
            if (this.userPortfolioData) {
              this.userPortfolioData.portfolio =
                this.userPortfolioData.portfolio || [];
              this.userPortfolioData.portfolio.forEach(
                (holding: PortfolioItem) => {
                  holding.currentValue = holding.quantity * holding.stock.price;
                }
              );
              this.totalPortfolioValue =
                this.userPortfolioData.portfolio.reduce(
                  (total: number, holding: PortfolioItem) =>
                    total + (holding.currentValue || 0),
                  0
                );
              this.subscription.add(portfolioSubscription);
            }
          },
          error: (err) => {
            console.error('Error fetching portfolio data:', err);
          },
        });
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  activeView: string = 'holdings';

  setActiveView(view: string) {
    this.activeView = view;
  }
}
