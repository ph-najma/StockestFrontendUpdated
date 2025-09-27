import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
declare var Razorpay: any;

@Component({
  selector: 'app-add-money',
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './add-money.component.html',
  styleUrl: './add-money.component.css',
})
export class AddMoneyComponent implements OnDestroy {
  amount: number = 0;
  quickAmounts: number[] = [1000, 2000, 5000, 10000];
  private subscription = new Subscription();
  constructor(
    private apiService: ApiService,
    private router: Router,
    private alertService: AlertService
  ) {}
  handleQuickAmount(value: number): void {
    this.amount = value;
  }

  handleProceed(): void {
    if (!this.amount || this.amount <= 0) {
      this.alertService.showAlert('Please enter a valid amount');
      return;
    }
    const createOrdersubscription = this.apiService
      .createOrder(this.amount)
      .subscribe(
        (order) => {
          const options: any = {
            key: 'rzp_test_sHq1xf34I99z5x',
            amount: order.amount,
            currency: order.currency,
            order_id: order.id,
            handler: (response: any) => {
              const payload = {
                order_id: order.id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              };
              this.apiService.verifyPayment(payload).subscribe(
                (result) => {
                  if (result.success) {
                    this.alertService.showAlert('Payment successful!');
                    this.router.navigate(['/home']);
                  } else {
                    this.alertService.showAlert('Payment verification failed!');
                  }
                },
                (error) => {
                  console.error(error);
                  this.alertService.showAlert('Payment verification error!');
                }
              );
            },
            prefill: {
              name: 'John Doe',
              email: 'john.doe@example.com',
              contact: '9999999999',
            },
            theme: {
              color: '#528FF0',
            },
          };

          const razorpay = new Razorpay(options);
          razorpay.open();
        },
        (error) => {
          console.error(error);
          this.alertService.showAlert('Failed to create order');
        }
      );
    this.subscription.add(createOrdersubscription);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
