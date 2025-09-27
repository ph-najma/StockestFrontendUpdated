import { Component, OnInit, OnDestroy } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ApiService } from '../../services/api.service';
import { User } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-user-list',
  imports: [HeaderComponent, RouterModule, AdminSidebarComponent, DatePipe],
  templateUrl: './admin-user-list.component.html',
  styleUrl: './admin-user-list.component.css',
})
export class AdminUserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  currentPage: number = 1;
  totalUsers: number = 0;
  totalPages: number = 1;
  limit: number = 10;
  private subscription = new Subscription();

  constructor(private apiService: ApiService, private router: Router) {}
  ngOnInit(): void {
    this.fetchUsers(this.currentPage);
  }
  fetchUsers(page: number) {
    const userListSubscription = this.apiService
      .userList(page, this.limit)
      .subscribe(
        (response) => {
          this.users = response.data.usersData;
          this.totalUsers = response.data.totalUsers;
          this.totalPages = response.data.totalPages;
        },
        (error) => {
          console.error('Error fetching users ', error);
        }
      );
    this.subscription.add(userListSubscription);
  }
  disableUser(userId: string, is_Blocked: boolean) {
    console.log(
      `${is_Blocked ? 'Enabling' : 'Disabling'} user with ID:`,
      userId
    );
    const disableUseSubscription = this.apiService
      .disableUser(userId)
      .subscribe({
        next: () => {
          alert(`User ${is_Blocked ? 'enabled' : 'disabled'} successfully`);

          const userIndex = this.users.findIndex((user) => user._id == userId);
          if (userIndex !== -1) {
            this.users[userIndex].is_Blocked = !is_Blocked;
          }
        },
        error: (err) => {
          console.error(
            `Error ${is_Blocked ? 'enabling' : 'disabling'} user:`,
            err
          );
          alert(`Failed to ${is_Blocked ? 'enable' : 'disable'} the user.`);
        },
      });
    this.subscription.add(disableUseSubscription);
  }
  viewPortfolio(userId: string) {
    this.router.navigate(['portfolioAdmin', userId]);
  }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchUsers(page);
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
