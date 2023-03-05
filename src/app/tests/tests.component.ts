import { Sistema } from '../models/system';
import { MathPowerService, MathPowerMethod } from '../shared/math-power.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-testes',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css']
})
export class TestsComponent implements OnInit {

  list_files = [
    {
      label: 'Inserir arquivo de linha (linha.csv)',
      placeholder: 'linha.csv',
      filename: 'linha.csv'
    },
    {
      label: 'Inserir arquivo de barra (barra.csv)',
      placeholder: 'barra.csv',
      filename: 'barra.csv'
    },
    {
      label: 'Inserir arquivo de falta (entrada_falta.txt)',
      placeholder: 'entrada_falta.txt',
      filename: 'entrada_falta.txt'
    }
  ];
  sistema: Sistema;
  files = {};

  valid = {};

  // math calc
  flow;
  tensoes;
  correntes;
  short;
  errors;

  constructor(private mathPowerService: MathPowerService) {
    // this.sistema = new Sistema(null, null, mathPowerService);
  }

  ngOnInit() {

  }

  ReceiveFile(event) {
    const key = event['name'];
    const data = clone(event['data']) as any[];
    this.files[key] = data;
    if (data.length > 1) {
      this.files[key] = data.splice(1);
    }
    if (data) {
      this.valid[key] = true;
    } else {
      this.valid[key] = false;
    }

    function clone(obj) {
      if (null == obj || 'object' !== typeof obj) { return obj; }
      const copy = obj.constructor();
      for (const attr in obj) {
        if (obj.hasOwnProperty(attr)) { copy[attr] = obj[attr]; }
      }
      return copy;
    }
  }

  Export(filename) {

  }

  canFlow(): boolean {
    return this.valid['linha.csv'] && this.valid['barra.csv'];
  }

  canShort(): boolean {
    return this.canFlow() && this.valid['entrada_falta.txt'];
  }

  CalculePowerFlow() {
    this.mathPowerService.calcule(this.files, MathPowerMethod.FPO)
      .catch((error) => { this.handlerError(error); })
      .then((data) => { this.handlerData(data); });
  }
  CalculeShortCircuit() {
    this.mathPowerService.calcule(this.files, MathPowerMethod.CC)
      .catch((error) => { this.handlerError(error); })
      .then((data) => { this.handlerData(data); });
  }

  handlerData(data) {
    let flow, tensoes, correntes;
    if (data) {
      flow = data['fluxo.csv'];
      tensoes = data['tensao_pos_falta.txt'];
      correntes = data['corrente_linha_falta.txt'];
      if (flow) {
        this.flow = flow;
      }
      if (tensoes) {
        this.tensoes = tensoes;
      }
      if (correntes) {
        this.correntes = correntes;
      }
    }
  }

  handlerError(error) {
    if (!error['ok']) {
      this.errors = { msg: 'Não foi possível conectar ao servidor' };
    }
    console.log(error);
  }



}
