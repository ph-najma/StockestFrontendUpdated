import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-admin-sidebar',
  imports: [RouterModule, CommonModule, CommonModule, LucideAngularModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css',
})
export class AdminSidebarComponent {
  menuItems = [
    { icon: 'home', label: 'Dashboard', path: '/adminHome' },
    { icon: 'users', label: 'Users', path: '/userList' },
    { icon: 'chart-line', label: 'Stocks', path: '/list' },
    {
      icon: 'shopping-cart',
      label: 'Order Management',
      path: '/ordermanagement',
    },
    { icon: 'receipt', label: 'Transactions', path: '/allTransactions' },
    { icon: 'wallet', label: 'Transaction Fees', path: '/transactions' },
    { icon: 'cogs', label: 'Set Limits', path: '/limit' },
    { icon: 'gift', label: 'Set Promotions', path: '/promotions' },
    { icon: 'play', label: 'Create Session', path: '/createSession' },
    { icon: 'list', label: 'Session', path: '/sessions' },
  ];
}
