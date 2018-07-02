import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, RequestMethod } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class MathPowerService {

  private url = 'http://0.0.0.0:5000/calcule/';
  private body: any[];

  constructor(private http: Http) { }

  getUrl(method) {
    return this.url + method;
  }

  calcule(system, method): Promise<any> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers, method: RequestMethod.Post });
    return this.http.post(this.getUrl(method), system, options).toPromise()
      .then(this.handleDataPromisse)
      .catch(this.handleErrorPromise)
      ;
  }

  private handleDataPromisse(res: Response) {
    const body = res.json();
    return body || [];
  }

  private handleErrorPromise(error: Response | any) {
    return Promise.reject(error.message || error);
  }
}
