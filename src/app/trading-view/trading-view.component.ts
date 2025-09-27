import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { StockService } from '../services/stock.service';
import { ActivatedRoute } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-trading-view',
  templateUrl: './trading-view.component.html',
  styleUrl: './trading-view.component.css',
})
export class TradingViewComponent implements AfterViewInit, OnInit, OnDestroy {
  private socket: Socket;
  private chart: any;
  private stockData: any[] = [];
  private transactions: any[] = [];
  private subscription = new Subscription();
  constructor(
    private stockService: StockService,
    private route: ActivatedRoute
  ) {
    this.socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'], // Ensure fallback to polling if needed
    });
  }
  ngOnInit(): void {
    this.socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
    });
    // Check connection status
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id); // Ensure the client connects
    });

    // Listen for stock updates
    this.socket.on('stock-update', (update: any) => {
      console.log('Stock update received:', update); // Log updates from the server
      const bar = this.createBarFromUpdate(update);
      this.chart.updateData([bar]); // Assuming you have a method to update the TradingView chart
    });

    // Listen for transaction updates
    this.socket.on('transaction-update', (transaction: any) => {
      console.log('Transaction update received:', transaction);
      const transactionBar = this.createTransactionBar(transaction);
      this.chart.updateData([transactionBar]);
    });
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe((params) => {
      const symbol = params['symbol'] || 'AAPL';
      this.loadTradingViewWidget(symbol);
    });
  }

  private loadTradingViewWidget(symbol: string): void {
    // Fetch stock data
    const getStockDataSubscription = this.stockService
      .getStockData(symbol)
      .subscribe(
        (response) => {
          this.stockData = response;
          console.log(this.stockData);
          // Fetch transaction data
          const getTransactionsSubscription = this.stockService
            .getTransactions(symbol)
            .subscribe(
              (transactions: any) => {
                this.transactions = transactions.data;

                console.log(transactions);
                this.initializeTradingViewWidget(symbol);
              },
              (error: any) => {
                console.error('Error fetching transactions:', error);
              }
            );
          this.subscription.add(getTransactionsSubscription);
        },
        (error) => {
          console.error('Error fetching stock data:', error);
        }
      );
    this.subscription.add(getStockDataSubscription);
  }

  private initializeTradingViewWidget(symbol: string): void {
    this.chart = new TradingView.widget({
      container_id: 'tradingview-widget-container',
      symbol: symbol,
      interval: 'D',
      theme: 'light',
      style: '1',
      locale: 'en',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      autosize: true,
      datafeed: {
        onReady: (
          cb: (config: { supported_resolutions: string[] }) => void
        ) => {
          setTimeout(() => cb({ supported_resolutions: ['D'] }), 0);
        },
        resolveSymbol: (
          symbolName: string,
          onSymbolResolvedCallback: (symbolInfo: any) => void
        ) => {
          onSymbolResolvedCallback({
            name: symbolName,
            ticker: symbolName,
            type: 'stock',
            session: '0900-1600',
            timezone: 'America/New_York',
            supported_resolutions: ['D'],
            has_intraday: false,
            has_no_volume: false,
          });
          console.log('this is stcok data', this.stockData);
        },
        getBars: (
          symbolInfo: any,
          resolution: string,
          rangeStartDate: number,
          rangeEndDate: number,
          onHistoryCallback: (bars: any[], meta: { noData: boolean }) => void
        ) => {
          console.log('getBars called with:', {
            symbolInfo,
            resolution,
            rangeStartDate,
            rangeEndDate,
          });
          console.log(this.stockData);
          const bars = this.mapDataToBars(this.stockData);
          console.log('Mapped bars:', this.mapDataToBars(this.stockData));

          console.log('Historical bars sent to the chart:', bars);

          onHistoryCallback(bars, { noData: bars.length === 0 });
        },
        subscribeBars: (
          symbolInfo: any,
          resolution: string,
          onRealtimeCallback: (bar: any) => void
        ) => {
          this.handleRealtimeUpdates(onRealtimeCallback);
        },
        unsubscribeBars: () => {
          // Handle unsubscription logic if necessary
        },
      },
    });
  }

  private mapDataToBars(data: any[]): any[] {
    return data.map((item) => ({
      time: new Date(item.date).getTime() / 1000, // UNIX timestamp
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));
  }

  private handleRealtimeUpdates(onRealtimeCallback: (bar: any) => void): void {
    // Listen to stock data updates via socket
    this.socket.on('stock-update', (update: any) => {
      console.log('Stock update received:', update);
      const bar = this.createBarFromUpdate(update);
      onRealtimeCallback(bar);
    });

    // Listen to transaction updates via socket
    this.socket.on('transaction-update', (transaction: any) => {
      console.log('Received transaction-update event:', transaction);
      const transactionBar = this.createTransactionBar(transaction);
      onRealtimeCallback(transactionBar);
    });
  }

  private createBarFromUpdate(update: any): any {
    return {
      time: new Date(update.date).getTime() / 1000,
      open: update.open,
      high: update.high,
      low: update.low,
      close: update.close,
      volume: update.volume,
    };
  }

  private createTransactionBar(transaction: any): any {
    const bar = {
      time: new Date(transaction.createdAt).getTime() / 1000,
      open: transaction.price,
      high: transaction.price,
      low: transaction.price,
      close: transaction.price,
      volume: transaction.quantity,
    };
    console.log('Formatted transaction bar:', bar);
    return bar;
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.subscription.unsubscribe();
  }
}
