import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements HttpInterceptor {
  constructor(private apiService: ApiService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (
          error.status === 403 &&
          error.error.message === 'User is blocked. Logged out'
        ) {
          this.apiService.logout();
          alert('You have been logged out because your account is blocked.');
        }
        return throwError(error);
      })
    );
  }
  private email: string | null = null;

  setEmail(email: string) {
    this.email = email;
  }
  getEmail(): string | null {
    return this.email;
  }
}
