import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, switchMap } from 'rxjs';
import { of } from 'rxjs';
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient); // Inject HttpClient to make requests
  const router = inject(Router); // Inject Router to navigate in case of login expiry

  // Retrieve the access token from session storage (or cookies)
  const accessToken = sessionStorage.getItem('token');
  let modifiedReq = req;

  if (accessToken) {
    modifiedReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }
  

  return next(modifiedReq).pipe(
    catchError((error) => {
      if (error.status === 401 && error.error.message === 'Token expired') {
        // If token is expired, try to refresh it
        return http.post('/refresh', {}).pipe(
          switchMap((refreshTokenResponse: any) => {
            // Save new access token
            sessionStorage.setItem('token', refreshTokenResponse.data.token);

            // Clone the original request with the new token and retry the request
            modifiedReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${refreshTokenResponse.data.token}`,
              },
            });

            return next(modifiedReq); // Retry the original request with the new token
          }),
          catchError((refreshError) => {
            // If refresh token fails, redirect to login page
            router.navigate(['/login']);
            return of(refreshError);
          })
        );
      }
      return of(error); // If the error is not token expiry, forward it
    })
  );
};
