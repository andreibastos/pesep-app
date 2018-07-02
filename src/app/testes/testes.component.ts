import { MathPowerService } from '../shared/math-power.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-testes',
  templateUrl: './testes.component.html',
  styleUrls: ['./testes.component.css']
})
export class TestesComponent implements OnInit {

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
      label: 'Inserir arquivo de falta (falta.txt)',
      placeholder: 'falta.txt',
      filename: 'falta.txt'
    }
  ];

  files = {};

  valid = {};

  // math calc
  flow;
  short;
  errors;

  constructor(private mathPowerService: MathPowerService) { }

  ngOnInit() {

  }

  ReceiveFile(event) {
    const key = event['name'], data = event['data'] as any[];
    this.files[key] = data;
    if (data) {
      this.valid[key] = true;
    } else {
      this.valid[key] = false;
    }
  }

  Export(filename) {

  }

  canFlow(): boolean {
    return this.valid['linha.csv'] && this.valid['barra.csv'];
  }

  canShort(): boolean {
    return this.canFlow() && this.valid['falta.txt'];
  }

  CalculePowerFlow() {
    this.mathPowerService.calcule(this.files, 'power_flow')
      .catch((error) => { this.handleError(error); })
      .then((data) => { this.flow = data; console.log(data); });
  }
  CalculeShortCircuit() {
    this.mathPowerService.calcule(this.files, 'short_circuit')
      .catch((error) => { this.handleError(error); })
      .then((data) => { this.flow = data; console.log(data); });
  }

  handleError(error) {
    if (!error['ok']) {
      this.errors = { msg: 'Não foi possível conectar ao servidor' };
    }
  }



}
