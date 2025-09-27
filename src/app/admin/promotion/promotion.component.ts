import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
import { Subscription } from 'rxjs';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { HeaderComponent } from '../header/header.component';
@Component({
  selector: 'app-promotion',
  imports: [FormsModule, CommonModule, AdminSidebarComponent, HeaderComponent],
  templateUrl: './promotion.component.html',
  styleUrl: './promotion.component.css',
})
export class PromotionComponent implements OnDestroy {
  private subscription = new Subscription();
  constructor(
    private apiService: ApiService,
    private alertService: AlertService
  ) {}

  signupBonus = {
    enabled: true,
    amount: 50,
    minimumDepositRequired: 0,
    expiryDays: 30,
  };

  referralBonus = {
    enabled: true,
    referrerAmount: 10,
    refereeAmount: 5,
    maxReferralsPerUser: 10,
    minimumDepositRequired: 100,
  };

  loyaltyRewards = {
    enabled: true,
    tradingAmount: 10000,
    rewardAmount: 50,
    timeframeInDays: 30,
  };

  // For tab switching
  selectedTab: 'signup' | 'referral' | 'loyalty' = 'signup';
  createPromotion() {
    const promotionData = {
      signupBonus: this.signupBonus,
      referralBonus: this.referralBonus,
      loyaltyRewards: this.loyaltyRewards,
    };
    const createPromotionSubscription = this.apiService
      .createPomotions(promotionData)
      .subscribe(
        (res) => {
          this.alertService.showAlert('promotion created successfully');
        },
        (error: any) => {
          this.alertService.showAlert('error creating ');
          console.error('Error creating promotion', error);
        }
      );
    this.subscription.add(createPromotionSubscription);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
