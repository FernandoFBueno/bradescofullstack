import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders} from '@angular/common/http';
import { PersistData }  from '../service/persistdata';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(
    private _persistData:PersistData
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler, ): Observable<HttpEvent<any>> {

      const newHeaders = new HttpHeaders({
        'Authorization': `${this._persistData.getToken()}`,
        'Content-Type': 'application/json'
      });
  
      const dupReq = request.clone({headers: newHeaders});
      
    return next.handle(dupReq);
  }
}