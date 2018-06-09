import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Fluxo } from '../../models/fluxo';
import { TestesRapidosService } from './../testes-rapidos.service';

@Component({
  selector: 'app-fluxo-potencia',
  templateUrl: './fluxo-potencia.component.html',
  styleUrls: ['./fluxo-potencia.component.css']
})
export class FluxoPotenciaComponent implements OnInit {

  fluxo: Array<any> = new Array();
  opcaoEscolhida = '';
  fluxoCalculado = false;
  linhaCompleta = false;
  barraCompleta = false;

  sistema: any;


  constructor(private testesRapidosService: TestesRapidosService) { }

  ngOnInit() {
  }


  CalculePowerFlow() {

    this.testesRapidosService.calcular(this.sistema).then(
      fluxo => {
        this.fluxo = fluxo;
        this.fluxoCalculado = true;
      }
    );
  }

  ExportFlow() { }

  escolherOpcao(opcao) {
    this.opcaoEscolhida = opcao;
  }

  carregouArquivos(event) {
    this.sistema = event;
    this.linhaCompleta = event['linhas'].length > 0;
    this.barraCompleta = event['barras'].length > 0;
  }

  calculouFluxo(event) {

  }
}
