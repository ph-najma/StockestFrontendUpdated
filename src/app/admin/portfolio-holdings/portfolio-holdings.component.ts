import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Stock } from '../../services/api.service';
import { PortfolioItem } from '../../services/api.service';

@Component({
  selector: 'app-portfolio-holdings',
  imports: [CommonModule],
  templateUrl: './portfolio-holdings.component.html',
  styleUrl: './portfolio-holdings.component.css',
})
export class PortfolioHoldingsComponent implements OnInit {
  @Input() portfolio: PortfolioItem[] = [];
  ngOnInit(): void {
    console.log(this.portfolio);
    this.portfolio.forEach((holding) => {
      holding.totalValue = holding.quantity * holding.stock.price;
    });

    // Step 2: Calculate total portfolio value (sum of all stock values)
    const totalPortfolioValue = this.portfolio.reduce(
      (total, holding) => total + (holding.totalValue || 0),
      0
    );

    // Step 3: Calculate Portfolio Allocation for each stock
    this.portfolio.forEach((holding) => {
      if (totalPortfolioValue > 0) {
        holding.allocation =
          (holding.totalValue ?? 0 / totalPortfolioValue) * 100;
      }
    });
  }
}
