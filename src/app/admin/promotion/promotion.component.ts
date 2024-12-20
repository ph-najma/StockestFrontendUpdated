import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-promotion',
  imports: [],
  templateUrl: './promotion.component.html',
  styleUrl: './promotion.component.css',
})
export class PromotionComponent {
  signupBonusForm: FormGroup;
  referralBonusForm: FormGroup;
  loyaltyRewardsForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.signupBonusForm = this.fb.group({
      enabled: [true],
      amount: [50],
      minimumDepositRequired: [0],
      expiryDays: [30],
    });

    this.referralBonusForm = this.fb.group({
      enabled: [true],
      referrerAmount: [10],
      refereeAmount: [5],
      maxReferralsPerUser: [10],
      minimumDepositRequired: [100],
    });

    this.loyaltyRewardsForm = this.fb.group({
      enabled: [true],
      tradingAmount: [10000],
      rewardAmount: [50],
      timeframeInDays: [30],
    });
  }

  saveChanges() {
    console.log('Sign-up Bonus:', this.signupBonusForm.value);
    console.log('Referral Bonus:', this.referralBonusForm.value);
    console.log('Loyalty Rewards:', this.loyaltyRewardsForm.value);
  }

  cancelChanges() {
    // Reset forms to initial values if needed
    this.signupBonusForm.reset({
      enabled: true,
      amount: 50,
      minimumDepositRequired: 0,
      expiryDays: 30,
    });
    this.referralBonusForm.reset({
      enabled: true,
      referrerAmount: 10,
      refereeAmount: 5,
      maxReferralsPerUser: 10,
      minimumDepositRequired: 100,
    });
    this.loyaltyRewardsForm.reset({
      enabled: true,
      tradingAmount: 10000,
      rewardAmount: 50,
      timeframeInDays: 30,
    });
  }
}
