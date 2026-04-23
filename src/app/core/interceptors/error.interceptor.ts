import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message =
        (error.error && (error.error.message || error.error.error)) ||
        error.message ||
        'An unexpected error occurred.';

      console.error('[HTTP ERROR]', error.status, message);

      return throwError(() => ({
        status: error.status,
        message: Array.isArray(message) ? message.join(', ') : message
      }));
    })
  );
};
