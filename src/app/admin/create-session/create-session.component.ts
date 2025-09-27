import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { SessionFromComponent } from '../session-from/session-from.component';
import { HeaderComponent } from '../header/header.component';
import { AlertService } from '../../services/alert.service';
import { Subscription } from 'rxjs';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
@Component({
  selector: 'app-create-session',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SessionFromComponent,
    HeaderComponent,
    AdminSidebarComponent,
  ],
  templateUrl: './create-session.component.html',
  styleUrl: './create-session.component.css',
})
export class CreateSessionComponent implements OnDestroy {
  private subscription = new Subscription();
  constructor(
    private apiservice: ApiService,
    private alertService: AlertService
  ) {}
  handleCreate(data: any) {
    const createSessionSubscription = this.apiservice
      .createSession(data)
      .subscribe((data) => {
        this.alertService.showAlert('created successfully');
      });
    this.subscription.add(createSessionSubscription);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
