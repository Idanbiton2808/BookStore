import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService : AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token  = this.authService.getToken();

    if(token){
      const clone = request.clone({
        setHeaders : {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(clone);
    }
    return next.handle(request);
  }
}
