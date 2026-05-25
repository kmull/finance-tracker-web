import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs';

let loggingEnabled = false;

// wystawiamy na window — dostępne w konsoli przeglądarki
(window as any).enableHttpLogging = () => {
  loggingEnabled = true;
  console.log('%c✅ HTTP logging włączone', 'color: #16a34a; font-weight: bold;');
};

(window as any).disableHttpLogging = () => {
  loggingEnabled = false;
  console.log('%c🔴 HTTP logging wyłączone', 'color: #dc2626; font-weight: bold;');
};

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {

  if (!loggingEnabled) {
    return next(req);
  }

  const start = Date.now();

  console.group(`%c🚀 ${req.method} ${req.url}`, 'color: #2563eb; font-weight: bold;');
  if (req.body) {
    console.log('%c📦 Request Body:', 'color: #7c3aed; font-weight: bold;', req.body);
  }
  console.groupEnd();

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        const duration = Date.now() - start;
        const color = event.status < 300 ? '#16a34a' : '#ea580c';

        console.group(
          `%c✅ ${req.method} ${req.url} → ${event.status} (${duration}ms)`,
          `color: ${color}; font-weight: bold;`
        );
        if (event.body) {
          console.log('%c📥 Response Body:', 'color: #0891b2; font-weight: bold;', event.body);
        }
        console.groupEnd();
      }
    }),
    catchError(error => {
      const duration = Date.now() - start;

      console.group(
        `%c❌ ${req.method} ${req.url} → ${error.status} (${duration}ms)`,
        'color: #dc2626; font-weight: bold;'
      );
      console.error('%c💥 Error Detail:', 'color: #dc2626; font-weight: bold;', error.error);
      console.groupEnd();

      throw error;
    })
  );
};
