import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-stop-orders',
  imports: [HeaderComponent, RouterModule, AdminSidebarComponent],
  templateUrl: './stop-orders.component.html',
  styleUrl: './stop-orders.component.css',
})
export class StopOrdersComponent {}
