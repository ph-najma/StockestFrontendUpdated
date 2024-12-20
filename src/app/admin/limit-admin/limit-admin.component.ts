import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { HeaderComponent } from '../header/header.component';
interface ILimit {
  maxBuyLimit: number;
  maxSellLimit: number;
  timeframeInHours: number;
}
@Component({
  selector: 'app-limit-admin',
  imports: [FormsModule, HeaderComponent],
  templateUrl: './limit-admin.component.html',
  styleUrl: './limit-admin.component.css',
})
export class LimitAdminComponent implements OnInit {
  limit: ILimit = {
    maxBuyLimit: 1000,
    maxSellLimit: 500,
    timeframeInHours: 24,
  };
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
    this.apiService.getLimits().subscribe({
      next: (data: ILimit) => {
        this.limit = data; // Update the component state with the fetched data
        console.log('Fetched limits:', data); // Debug log
      },
      error: (err) => {
        console.error('Failed to fetch limits:', err); // Handle error
        this.saveStatus = 'error';
      },
    });
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

    this.apiService.saveLimits(this.limit).subscribe({
      next: () => {
        this.saveStatus = 'success';
        this.isChanged = false;
        this.isDialogOpen = true;
        this.fetchLimits();
      },
      error: () => {
        this.saveStatus = 'error';
        this.isDialogOpen = true;
      },
    });
  }
}
