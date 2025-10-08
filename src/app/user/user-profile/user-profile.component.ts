import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserHeaderComponent } from '../user-header/user-header.component';
import { ApiService } from '../../services/api.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ImagekitUploadService } from '../../services/imagekit-upload.service';
interface Rewards {
  signupBonus?: {
    enabled: boolean;
    amount: number;
    minimumDepositRequired?: number;
    expiryDays?: number;
  };
  referralBonus?: {
    enabled: boolean;
    referrerAmount: number;
    refereeAmount: number;
    maxReferralsPerUser?: number;
    minimumDepositRequired?: number;
  };
  loyaltyRewards?: {
    enabled: boolean;
    tradingAmount: number;
    rewardAmount: number;
    timeframeInDays?: number;
  };
}

@Component({
  selector: 'app-user-profile',
  imports: [FormsModule, UserHeaderComponent, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user = {
    name: 'NIZAM',
    fullName: 'NIZAM P H',
    profilePhoto: 'assets/profile.jpg',
    refferalCode: '',
  };
  rewards: Rewards = {};
  private subscriptions = new Subscription();
  isEligibleForsignupBonus: boolean = true;
  isEligibleForReferralBonus: boolean = false;
  isEligibleForLoyaltyRewards: boolean = false;

  constructor(
    private apiService: ApiService,
    private uploadService: ImagekitUploadService
  ) {}
  ngOnInit(): void {
    this.fetchUserDetails();
  }
  fetchUserDetails(): void {
    const userDetailsSubscription = this.apiService.getUserProfile().subscribe({
      next: (response: any) => {
        console.log(response);
        this.user.name = response.data.name;
        this.user.fullName = response.data.fullName || 'unknown user';
        this.user.profilePhoto =
          response.data.profilePhoto || 'assets/default-profile.png';
        this.user.refferalCode = response.data.refferalCode;

        this.isEligibleForLoyaltyRewards =
          response.data.isEligibleForLoyaltyRewards;
        this.isEligibleForReferralBonus =
          response.data.isEligibleForReferralBonus;
      },
      error: (err) => console.error('Failed to fetch user details:', err),
    });
    this.subscriptions.add(userDetailsSubscription);

    const promotionSubscription = this.apiService.getPromotions().subscribe({
      next: (response: any) => {
        console.log(response);
        this.rewards = response.data;
        console.log(this.rewards);
      },
    });
    this.subscriptions.add(promotionSubscription);
  }
  async onPhotoUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const result = await this.uploadService.upload(file);
      const imageUrl = result?.url || result?.filePath || result?.thumbnailUrl;
      if (imageUrl) {
        // Update UI immediately
        this.user.profilePhoto = imageUrl;
        // Persist to backend
        this.apiService.updateProfilePhoto(imageUrl).subscribe({
          next: () => {
            console.log('✅ Profile photo saved');
          },
          error: (err) => {
            console.error('❌ Failed to save profile photo:', err);
          },
        });
      }
      console.log('✅ Uploaded Successfully:', result);
    } catch (err) {
      console.error('❌ Upload Failed:', err);
    }
  }
  resetPhoto(): void {
    this.user.profilePhoto = 'assets/default-profile.png'; // Reset to default image
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
