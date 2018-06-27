import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Fluxo } from '../../models/fluxo';
import { MathPowerService } from './../testes-rapidos.service';
import { ExportDownload } from '../../utils/export';

@Component({
  selector: 'app-fluxo-potencia',
  templateUrl: './fluxo-potencia.component.html',
  styleUrls: ['./fluxo-potencia.component.css']
})
export class FluxoPotenciaComponent implements OnInit {

  fluxo: Array<any> = new Array();
  result: {};
  opcaoEscolhida = '';
  fluxoCalculado = false;
  linhaCompleta = false;
  barraCompleta = false;

  system: any;


  constructor(private mathPowerService: MathPowerService) {
  }

  ngOnInit() {
  }


  CalculePowerFlow() {

    this.mathPowerService.calcule(this.system, 'power_flow').then(
      result => {
        this.fluxo = result['power_flow'];
        this.result = result;
        this.fluxoCalculado = true;
      }
    );
  }

  Export(file) {
    let data;
    switch (file) {
      case 'fluxo.csv':
        data = this.result['power_flow'];
        break;
      case 'susceptancia.txt':
        data = this.result['susceptance'];
        break;
      case 'linhas.txt':
        data = this.result['lines'];
        break;
      case 'colunas.txt':
        data = this.result['columns'];
        break;
    }

    ExportDownload.export(data, file);

  }

  escolherOpcao(opcao) {
    this.opcaoEscolhida = opcao;
  }

  carregouArquivos(event) {
    this.system = event;
    this.linhaCompleta = event['linhas'].length > 0;
    this.barraCompleta = event['barras'].length > 0;
  }

  calculouFluxo(event) {

  }

}
