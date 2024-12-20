import { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router); // Inject Router service

  return next(req).pipe(
    tap({
      error: (error: HttpErrorResponse) => {
        console.log('HTTP Error:', error); // Log the full error to see what is happening

        if (error.status === 403) {
          console.log('User account is blocked, redirecting to login...');
          alert('You have been logged out because your account was blocked.');
          sessionStorage.removeItem('token'); // Remove the user token
          router.navigate(['/login']); // Redirect to login page
        }
      },
    })
  );
};
