import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-header',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-header.component.html',
  styleUrl: './user-header.component.css',
})
export class UserHeaderComponent {
  constructor(private apiservice: ApiService, private router: Router) {}
  dropdownOpen: boolean = false;
  isMobileMenuOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    const profileSection = document.querySelector('.relative');
    if (profileSection && !profileSection.contains(target)) {
      this.dropdownOpen = false;
    }
  }

  logout() {
    sessionStorage.removeItem('token'); // Remove token
    this.apiservice.logout(); // Call the logout method from ApiService
    this.router.navigate(['/login']); // Redirect to login page
  }
  profile() {
    this.router.navigate(['/userProfile']);
  }
  isActive(path: string): boolean {
    return this.router.url.includes(path);
  }

  market() {
    this.router.navigate(['/stocks']);
  }

  searchQuery: string = '';
  suggestions: any[] = [];
  loading: boolean = false;
  private searchSubject: Subject<string> = new Subject();

  handleClear(): void {
    this.searchQuery = '';
    this.suggestions = [];
  }
  ngOnInit(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          this.loading = true;
          return this.apiservice.searchStocks(query);
        })
      )
      .subscribe(
        (response: any) => {
          this.suggestions = response.data;
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching suggestions:', error);
          this.loading = false;
        }
      );
  }
  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.searchSubject.next(this.searchQuery.trim());
    } else {
      this.handleClear(); // Clear suggestions when the input is empty
    }
  }

  selectSuggestion(stock: any): void {
    this.router.navigate(['/stockdetails', stock.symbol]); // Navigate to stock details
  }
}
