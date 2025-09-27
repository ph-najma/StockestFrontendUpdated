import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { Router, RouterModule } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { Subscription } from 'rxjs';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
export interface Session {
  instructor_name: string;
  specialization: string;
  hourly_rate: number;
  start_time: string;
  end_time: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELED';
}

@Component({
  selector: 'app-session',
  imports: [
    NgClass,
    DatePipe,
    CommonModule,
    HeaderComponent,
    RouterModule,
    AdminSidebarComponent,
  ],
  templateUrl: './session.component.html',
  styleUrl: './session.component.css',
})
export class SessionComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  currentPage: number = 1;
  totalUsers: number = 0;
  totalPages: number = 1;
  limit: number = 10;

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchData();
    }
  }
  sessions: any[] = [];
  constructor(
    private apiService: ApiService,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }
  fetchData() {
    const getSessionSubscription = this.apiService
      .getSession()
      .subscribe((response: any) => {
        console.log(response);
        this.sessions = response.data;
      });
    this.subscription.add(getSessionSubscription);
  }
  editSession(session: any) {
    this.router.navigate(['/editSession', session._id]);
  }

  deleteSession(session: any) {
    const newStatus = 'CANCELED';
    const cancelSessionSubscription = this.apiService
      .cancelSession(session._id, newStatus)
      .subscribe((data) => {
        this.alertService.showAlert('canceled successfully');
        this.fetchData();
      });
    this.subscription.add(cancelSessionSubscription);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
