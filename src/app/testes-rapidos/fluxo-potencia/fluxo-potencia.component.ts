import { Component, OnInit } from '@angular/core';
import { Fluxo } from '../../models/fluxo';

@Component({
  selector: 'app-fluxo-potencia',
  templateUrl: './fluxo-potencia.component.html',
  styleUrls: ['./fluxo-potencia.component.css']
})
export class FluxoPotenciaComponent implements OnInit {

  opcaoEscolhida = '';

  fluxoCalculado = false;
  linhaCompleta = false;
  barraCompleta = false;



  constructor() { }

  ngOnInit() {
  }


  calcularFluxo() {
    console.log('Calculado');
  }

  escolherOpcao(opcao) {
    this.opcaoEscolhida = opcao;
  }

  carregouArquivos(event) {
    console.log(event);
    this.linhaCompleta = event['linhas'].length > 0;
    this.barraCompleta = event['barras'].length > 0;
  }
}
