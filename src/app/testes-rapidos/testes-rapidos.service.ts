import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Fluxo } from './../models/fluxo';

@Injectable({
  providedIn: 'root'
})
export class TestesRapidosService {

  url = 'http://0.0.0.0:5000/calcule/';


  body: any[];

  constructor(private http: Http) { }

  getUrl(method) {
    return this.url + method;
  }


  calcular(sistema): Promise<any> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(this.getUrl('power_flow'), sistema, options).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  private extractData(res: Response) {
    const body = res.json();
    console.log(body);
    return body || [];
  }

  private handleErrorPromise(error: Response | any) {
    console.error(error.message || error);
    return Promise.reject(error.message || error);
  }
}
