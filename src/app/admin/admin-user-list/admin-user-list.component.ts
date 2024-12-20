import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ApiService } from '../../services/api.service';
import { User } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-user-list',
  imports: [HeaderComponent],
  templateUrl: './admin-user-list.component.html',
  styleUrl: './admin-user-list.component.css',
})
export class AdminUserListComponent implements OnInit {
  users: User[] = [];

  constructor(private apiService: ApiService, private router: Router) {}
  ngOnInit(): void {
    this.fetchUsers();
  }
  fetchUsers() {
    this.apiService.userList().subscribe(
      (data) => {
        console.log(data);
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users ', error);
      }
    );
  }
  disableUser(userId: string, is_Blocked: boolean) {
    console.log(
      `${is_Blocked ? 'Enabling' : 'Disabling'} user with ID:`,
      userId
    );
    this.apiService.disableUser(userId).subscribe({
      next: () => {
        alert(`User ${is_Blocked ? 'enabled' : 'disabled'} successfully`);
        this.fetchUsers();
      },
      error: (err) => {
        console.error(
          `Error ${is_Blocked ? 'enabling' : 'disabling'} user:`,
          err
        );
        alert(`Failed to ${is_Blocked ? 'enable' : 'disable'} the user.`);
      },
    });
  }
  viewPortfolio(userId: string) {
    this.router.navigate(['portfolioAdmin', userId]);
  }
}
