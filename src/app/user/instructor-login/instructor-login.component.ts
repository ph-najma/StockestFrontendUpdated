import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { LoginFormData } from '../../interfaces/userInterface';
import { Router } from '@angular/router';
import { MainLoginComponent } from '../../main-login/main-login.component';
import { RightsideLoginComponent } from '../../rightside-login/rightside-login.component';
@Component({
  selector: 'app-instructor-login',
  imports: [MainLoginComponent, RightsideLoginComponent],
  templateUrl: './instructor-login.component.html',
  styleUrl: './instructor-login.component.css',
})
export class InstructorLoginComponent {
  loading: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;
  isInstructorLogin: boolean = true;
  private subscription = new Subscription();
  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit(userData: LoginFormData) {
    this.error = null;
    this.successMessage = null;
    this.loading = true;

    const loginSubscription = this.apiService.login(userData).subscribe(
      (response: any) => {
        if (response.data.token && response.data.user.is_instructor) {
          sessionStorage.setItem('token', response.data.token);
          this.loading = false;
          this.successMessage = 'Successfully logged in';
          this.router.navigate(['/instructorhome']);
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
