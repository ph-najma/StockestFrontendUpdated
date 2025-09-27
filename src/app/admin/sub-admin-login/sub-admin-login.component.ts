import { Component, OnDestroy } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MainLoginComponent } from '../../main-login/main-login.component';
import { AdminLoginData, LoginResponse } from '../../interfaces/userInterface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sub-admin-login',
  imports: [ReactiveFormsModule, MainLoginComponent, MainLoginComponent],
  templateUrl: './sub-admin-login.component.html',
  styleUrl: './sub-admin-login.component.css',
})
export class SubAdminLoginComponent implements OnDestroy {
  loading: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;
  private subscription = new Subscription();

  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit(adminData: AdminLoginData) {
    this.error = null;
    this.successMessage = null;
    this.loading = true;

    const loginSubscription = this.apiService.loginAdmin(adminData).subscribe(
      (response: LoginResponse) => {
        if (response.data) {
          sessionStorage.setItem('token', response.data.token);
          this.loading = false;
          this.successMessage = 'Successfully logged in';
          this.router.navigate(['/adminHome']);
        }
      },
      (error) => {
        this.loading = false;
        this.error = 'Something went wrong. Please try again later.';
      }
    );
    this.subscription.add(loginSubscription);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
