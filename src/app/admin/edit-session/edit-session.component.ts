import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionFromComponent } from '../session-from/session-from.component';
import { HeaderComponent } from '../header/header.component';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert.service';
import { Subscription } from 'rxjs';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
@Component({
  selector: 'app-edit-session',
  imports: [
    SessionFromComponent,
    HeaderComponent,
    RouterModule,
    CommonModule,
    AdminSidebarComponent,
  ],
  templateUrl: './edit-session.component.html',
  styleUrl: './edit-session.component.css',
})
export class EditSessionComponent implements OnInit, OnDestroy {
  sessionData: any = null;
  sessionId: string = '';
  private subscription = new Subscription();

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.sessionId = this.route.snapshot.paramMap.get('sessionId') || '';
    if (this.sessionId) {
      this.fetchData(this.sessionId);
    }
  }

  fetchData(sessionId: string) {
    const getSessionSubcription = this.apiService
      .getSessionById(sessionId)
      .subscribe((response) => {
        this.sessionData = response.data;
      });
    this.subscription.add(getSessionSubcription);
  }

  handleEdit(data: any) {
    const updateSessionSubscription = this.apiService
      .updateSession(this.sessionId, data)
      .subscribe((data) => {
        this.alertService.showAlert('updated successfully');
      });
    this.subscription.add(updateSessionSubscription);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
