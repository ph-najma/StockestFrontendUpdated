import { Component, OnDestroy } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MainLoginComponent } from '../../main-login/main-login.component';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoginFormData } from '../../interfaces/userInterface';
import { RightsideLoginComponent } from '../../rightside-login/rightside-login.component';

@Component({
  selector: 'app-sub-login',
  imports: [
    ReactiveFormsModule,
    MainLoginComponent,
    MainLoginComponent,
    RightsideLoginComponent,
    CommonModule,
  ],
  templateUrl: './sub-login.component.html',
  styleUrl: './sub-login.component.css',
})
export class SubLoginComponent implements OnDestroy {
  loading: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;
  isUserLogin: boolean = true;
  private subscription = new Subscription();
  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit(userData: LoginFormData) {
    this.error = null;
    this.successMessage = null;
    this.loading = true;

    const loginSubscription = this.apiService.login(userData).subscribe(
      (response: any) => {
        if (response.data.token) {
          sessionStorage.setItem('token', response.data.token);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          this.loading = false;
          this.successMessage = 'Successfully logged in';
          this.router.navigate(['/home']);
        } else {
          this.loading = false;
          this.error = 'Invalid response from server.';
        }
      },
      (error) => {
        this.loading = false;
        this.error = 'Something went wrong. Please try again later.';
        console.error('Login error:', error);
      }
    );
    this.subscription.add(loginSubscription);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
