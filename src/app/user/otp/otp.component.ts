import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-otp',
  imports: [FormsModule, CommonModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css',
})
export class OtpComponent implements OnInit, OnDestroy {
  otp: string = '';
  loading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  email: string = '';
  remainingTime: number = 300;
  timer: any;
  private subscription = new Subscription();
  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
    });

    this.startTimer();
  }

  startTimer() {
    this.timer = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        clearInterval(this.timer);
      }
    }, 1000);
  }

  onSubmit() {
    this.loading = true;
    const verifyOtpSubscription = this.apiService
      .verifyOtp({ otp: this.otp })
      .subscribe(
        (response) => {
          this.loading = false;
          this.successMessage = 'OTP verified! You are successfully signed up.';
          this.router.navigate(['/home']);
        },
        (error) => {
          this.loading = false;
          this.errorMessage = 'Invalid OTP. Please try again.';
        }
      );
    this.subscription.add(verifyOtpSubscription);
  }

  resendOtp() {
    this.loading = true;
    const resendOTPSubscription = this.apiService
      .resendOtp({ email: this.email })
      .subscribe(
        (response) => {
          this.loading = false;
          this.successMessage = 'New OTP sent to your email!';
          this.remainingTime = 300;
          this.startTimer();
        },
        (error) => {
          this.loading = false;
          this.errorMessage = 'Failed to resend OTP. Please try again.';
        }
      );
    this.subscription.add(resendOTPSubscription);
  }
  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.subscription.unsubscribe();
  }
}
