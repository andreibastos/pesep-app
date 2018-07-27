import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, RequestMethod } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class MathPowerService {

  private url = 'https://35.237.112.162:5000/calcule/';
  private body: any[];

  constructor(private http: Http) { }

  getUrl(method: MathPowerMethod) {
    return this.url + method.toString();
  }

  calcule(system, methodPower: MathPowerMethod): Promise<any> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers, method: RequestMethod.Post });
    return this.http.post(this.getUrl(methodPower), system, options).toPromise()
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

export enum MathPowerMethod {
  'FPO' = 'power_flow',
  'CC' = 'short_circuit'
}
