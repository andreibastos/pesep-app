import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestesRapidosService {

  constructor(private http: Http) { }

  calcularFluxoPotencia(sistema) {
    this.http.post('/read_file', sistema).subscribe(
      (data) => {
        console.log(data);
      }
    );
  }
}
