import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { response } from 'express';
import { DatePipe, DecimalPipe } from '@angular/common';
interface ILimit {
  maxBuyLimit: number;
  maxSellLimit: number;
  timeframeInHours: number;
}
@Component({
  selector: 'app-limit-admin',
  imports: [
    FormsModule,
    HeaderComponent,
    RouterModule,
    AdminSidebarComponent,

    DecimalPipe,
  ],
  templateUrl: './limit-admin.component.html',
  styleUrl: './limit-admin.component.css',
})
export class LimitAdminComponent implements OnInit, OnDestroy {
  limit: ILimit = {
    maxBuyLimit: 1000,
    maxSellLimit: 500,
    timeframeInHours: 24,
  };
  private subscription = new Subscription();
  ngOnInit(): void {
    this.fetchLimits();
  }

  isChanged = false;
  saveStatus: 'idle' | 'success' | 'error' = 'idle';
  isDialogOpen = false;

  constructor(private apiService: ApiService) {}

  validateLimits(): boolean {
    return (
      this.limit.maxBuyLimit > 0 &&
      this.limit.maxSellLimit > 0 &&
      this.limit.timeframeInHours > 0
    );
  }

  fetchLimits(): void {
    const limitSubscription = this.apiService.getLimits().subscribe({
      next: (response) => {
        this.limit = response.data;
      },
      error: (err) => {
        console.error('Failed to fetch limits:', err);
        this.saveStatus = 'error';
      },
    });
    this.subscription.add(limitSubscription);
  }

  handleInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const { name, value } = target;

    this.limit = {
      ...this.limit,
      [name]: Number(value),
    };

    this.isChanged = true;
  }

  handleSaveLimits(): void {
    if (!this.validateLimits()) {
      this.saveStatus = 'error';
      this.isDialogOpen = true;
      return;
    }

    const newLimitSubscription = this.apiService
      .saveLimits(this.limit)
      .subscribe({
        next: (response) => {
          this.limit = response.data;
          this.saveStatus = 'success';
          this.isChanged = false;
          this.isDialogOpen = true;
        },
        error: () => {
          this.saveStatus = 'error';
          this.isDialogOpen = true;
        },
      });
    this.subscription.add(newLimitSubscription);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
