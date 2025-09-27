import { Component, Input } from '@angular/core';
interface statistics {
  buyTransactions: number;
  sellTransactions: number;
  total: number;
  totalVolume: number;
}
@Component({
  selector: 'app-trans-statistics',
  imports: [],
  templateUrl: './trans-statistics.component.html',
  styleUrl: './trans-statistics.component.css',
})
export class TransStatisticsComponent {
  @Input() stats: statistics = {
    buyTransactions: 0,
    sellTransactions: 0,
    total: 0,
    totalVolume: 0,
  };
}
