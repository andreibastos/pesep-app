import { Component, OnInit } from '@angular/core';
import { Fluxo } from '../../models/fluxo';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule, Http } from '@angular/http';



@Component({
  selector: 'app-fluxo-potencia',
  templateUrl: './fluxo-potencia.component.html',
  styleUrls: ['./fluxo-potencia.component.css']
})
export class FluxoPotenciaComponent implements OnInit {

  arquivoBarra: any;
  fluxoPotencia: any[];
  cabecalho = Fluxo.cabecalho;


  constructor(private http: Http) { }

  ngOnInit() {
  }

  lerArquivo(arquivo) {
    // console.log(arquivo);

    const value = arquivo.value;
    console.log(value);
    // this.http.post('http://localhost:8080/read_file', JSON.stringify(arquivo.value))
    // .subscribe(dados => console.log(dados));
  }

  lerArquivoBarra() {
    console.log('Arquivo barra');
  }

  lerArquivoLinha() {
    console.log('Arquivo linha');
  }

  calcularFluxo(form) {
    console.log(form);
    console.log(this.arquivoBarra);
    this.fluxoPotencia = new Array();
    this.fluxoPotencia.push('andrei');
  }
}
