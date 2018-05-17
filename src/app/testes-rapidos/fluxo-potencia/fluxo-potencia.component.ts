import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fluxo-potencia',
  templateUrl: './fluxo-potencia.component.html',
  styleUrls: ['./fluxo-potencia.component.css']
})
export class FluxoPotenciaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  lerArquivoBarra() {
    console.log('Arquivo barra');
  }

  lerArquivoLinha() {
    console.log('Arquivo linha');
  }

}
