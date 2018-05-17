import { Component, OnInit } from '@angular/core';
import { Fluxo } from '../../models/fluxo';

@Component({
  selector: 'app-fluxo-potencia',
  templateUrl: './fluxo-potencia.component.html',
  styleUrls: ['./fluxo-potencia.component.css']
})
export class FluxoPotenciaComponent implements OnInit {

  fluxoPotencia: any[];
  cabecalho = Fluxo.cabecalho;


  constructor() { }

  ngOnInit() {
  }

  lerArquivoBarra() {
    console.log('Arquivo barra');
  }

  lerArquivoLinha() {
    console.log('Arquivo linha');
  }

  calcularFluxo() {
    this.fluxoPotencia = new Array();
    this.fluxoPotencia.push('andrei');
  }
}
