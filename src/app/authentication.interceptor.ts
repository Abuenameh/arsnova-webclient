import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from './authentication.service';

const AUTH_HEADER_KEY = 'Arsnova-Auth-Token';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authenticationService.getUser().token;

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set(AUTH_HEADER_KEY, token)
      });

      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }

}
