import { CommonModule, CurrencyPipe, NgClass } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../services/api.service';
import { MatIconModule } from '@angular/material/icon';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserHeaderComponent } from '../user-header/user-header.component';

interface TradeDetail {
  time: string;
  type: string;
  symbol: string;
  quantity: number;
  entry: number;
  exit: number;
  pnl: number;
  notes: string;
}
interface Trade {
  date: string;
  trades: number;
  overallPL: number;
  netPL: number;
  status: string;
  details: TradeDetail[];
}

@Component({
  selector: 'app-trade-diary',
  imports: [
    CommonModule,
    NgClass,
    MatCardModule,
    MatButtonModule,
    UserHeaderComponent,
    MatIconModule,
    CalendarModule,
    FormsModule,
    FontAwesomeModule,
  ],
  templateUrl: './trade-diary.component.html',
  styleUrl: './trade-diary.component.css',
})
export class TradeDiaryComponent implements OnInit, OnDestroy {
  selectedDate: Date = new Date();
  selectedView = 'daily';
  showTradeDetails = false;
  selectedTrade: Trade | null = null;
  tradeData: any = {
    winRate: 0,
    averageWin: 0,
    averageLoss: 0,
    overallPL: 0,
    netPL: 0,
    totalTrades: 0,
    charges: 0,
    brokerage: 0,
    trades: [],
  };
  currentDate = new Date();
  private subscriptions = new Subscription();
  constructor(private apiService: ApiService) {}

  setSelectedView(view: string) {
    this.selectedView = view;
  }
  ngOnInit(): void {
    // this.nitializeTradeData();
    this.fetchdata();
  }
  fetchdata() {
    const year = this.selectedDate.getFullYear();
    const month = this.selectedDate.getMonth();
    const date = this.selectedDate.getDate();
    const selectedDateStr = new Date(year, month, date).toDateString(); // Format the selected date as 'YYYY-MM-DD'

    const tradeDiarySubscription = this.apiService
      .getTradeDiary()
      .subscribe((response) => {
        console.log(response);
        if (response.data && response.data.trades) {
          this.tradeData = response.data; // Assuming 'data' contains a 'trades' field which is an array
          this.filterTradesByDate(selectedDateStr); // Filter trades based on selected date
        }
      });
    this.subscriptions.add(tradeDiarySubscription);
  }
  filterTradesByDate(selectedDateStr: string) {
    const formattedDate = new Date(selectedDateStr).toDateString(); // "Tue Nov 05 2024"
    console.log(this.tradeData);
    const selectedTradeData = this.tradeData.trades.filter((trade: any) => {
      const tradeDateStr = new Date(trade.date).toDateString();
      console.log(formattedDate, '=>', tradeDateStr); // normalize trade date
      return tradeDateStr === formattedDate;
    });
    console.log(selectedTradeData);

    if (selectedTradeData.length > 0) {
      this.selectedTrade = selectedTradeData[0];
      this.showTradeDetails = true;
    } else {
      this.selectedTrade = null;
      this.showTradeDetails = false;
    }
  }

  onDayClick(day: number) {
    // Format the date as 'YYYY-MM-DD'
    const selectedDateStr = `${this.selectedDate.getFullYear()}-${
      this.selectedDate.getMonth() + 1
    }-${day}`;
    this.selectedDate = new Date(selectedDateStr);
    this.fetchdata(); // Fetch the data for the selected date
  }

  nitializeTradeData() {
    // Example of setting values.
    //  Replace with actual data fetching logic
    this.tradeData = {
      winRate: 75,
      averageWin: 500,
      averageLoss: 300,
      overallPL: 10000,
      netPL: 8000,
      totalTrades: 50,
      charges: 200,
      brokerage: 150,
      trades: [
        {
          date: '05 Nov 2024',
          trades: 5,
          overallPL: 5000,
          netPL: 4000,
          status: 'Completed',
        },
      ],
    };
  }
  getTradeSummary(field: string): number {
    const selectedDateStr = this.selectedDate.toDateString();

    const selectedTradeData = this.tradeData.trades.filter(
      (trade: any) => new Date(trade.date).toDateString() === selectedDateStr
    );

    if (selectedTradeData.length > 0) {
      return selectedTradeData[0][field] || 0;
    }
    return 0;
  }

  prevMonth() {
    this.selectedDate.setMonth(this.selectedDate.getMonth() - 1);
  }

  nextMonth() {
    this.selectedDate.setMonth(this.selectedDate.getMonth() + 1);
  }

  getMonthYear(date: Date): string {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  getDaysInMonth(date: Date) {
    const numDays = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
    let days = Array(numDays)
      .fill(null)
      .map((_, idx) => idx + 1);
    return days;
  }

  handleTradeClick(trade: any) {
    this.selectedTrade = trade;
    this.showTradeDetails = true;
  }

  setShowTradeDetails(show: boolean) {
    this.showTradeDetails = show;
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe;
  }
}
