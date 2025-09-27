import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserHeaderComponent } from '../user-header/user-header.component';
import { StockService } from '../../services/stock.service';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stock-details',
  imports: [CommonModule, UserHeaderComponent, RouterModule],
  templateUrl: './stock-details.component.html',
  styleUrl: './stock-details.component.css',
})
export class StockDetailsComponent implements OnInit, OnDestroy {
  stocks: any;
  symbol: string = '';
  constructor(
    private stockService: StockService,
    private route: ActivatedRoute
  ) {}
  private subscription = new Subscription();
  ngOnInit(): void {
    this.symbol = this.route.snapshot.paramMap.get('symbol')!;
    this.fetchdata();
  }
  fetchdata() {
    const historicalDataSubscription = this.stockService
      .getHistroical(this.symbol)
      .subscribe((response) => {
        this.stocks = response.data;
      });
    this.subscription.add(historicalDataSubscription);
  }

  get isPositiveChange(): boolean {
    return this.stocks.change >= 0;
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
