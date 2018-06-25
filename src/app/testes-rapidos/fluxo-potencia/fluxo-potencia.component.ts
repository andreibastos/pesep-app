import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Fluxo } from '../../models/fluxo';
import { MathPowerService } from './../testes-rapidos.service';

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

    this.mathPowerService.calcular(this.system, 'power_flow').then(
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
        data = this.arrayToTxt(this.result['power_flow']);
        break;
      case 'susceptancia.txt':
        data = this.arrayToTxt(this.result['susceptance']);
        break;
      case 'linhas.txt':
        data = this.arrayToTxt(this.result['lines']);
        break;
      case 'colunas.txt':
        data = this.arrayToTxt(this.result['columns']);
        break;
    }
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = `${file}`; /* your file name*/
    a.click();
    return 'success';
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

  arrayToTxt(array) {
    let str = '';
    array.forEach(row => {
      row.forEach(column => {
        str += column + ',';
      });
      str = str.slice(0, -1);
      str += '\n';
    });
    return str;
  }
}
