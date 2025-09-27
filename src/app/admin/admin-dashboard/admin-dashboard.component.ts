import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { ApiService } from '../../services/api.service';
import { response } from 'express';
import { DecimalPipe } from '@angular/common';
@Component({
  selector: 'app-admin-dashboard',
  imports: [HeaderComponent, RouterModule, AdminSidebarComponent, DecimalPipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  summary: any = {};
  constructor(private apiService: ApiService) {}
  ngOnInit(): void {
    this.apiService.getHomeData().subscribe({
      next: (response: any) => {
        this.summary = response.data;
      },
      error: (err) => {
        console.error('Error fetching stocks:', err);
      },
    });
  }
}
