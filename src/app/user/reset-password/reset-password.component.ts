import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service'; // Assuming this service handles API calls
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  otp: string = '';
  newPassword: string = '';
  loading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  email: string | null = '';
  private subscription = new Subscription();

  constructor(
    private apiservice: ApiService,
    private router: Router,
    private auth: AuthService
  ) {}
  ngOnInit(): void {
    this.email = this.auth.getEmail();
  }
  // Handle form submission to reset password
  onSubmit() {
    this.loading = true;
    this.successMessage = null;
    this.errorMessage = null;

    // Call the API to reset the password
    const resetPasswordSubscriptin = this.apiservice
      .resetPassword({
        email: this.email,
        otp: this.otp,
        newPassword: this.newPassword,
      })
      .subscribe(
        (response) => {
          console.log(' respnse from', response);
          this.successMessage = 'Your password has been successfully reset!';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        (error) => {
          this.errorMessage = 'Invalid OTP or password reset failed';
        }
      );
    this.subscription.add(resetPasswordSubscriptin);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
