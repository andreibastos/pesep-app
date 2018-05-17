import { Fluxo } from './../../models/fluxo';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fluxo-tabela',
  templateUrl: './fluxo-tabela.component.html',
  styleUrls: ['./fluxo-tabela.component.css']
})
export class FluxoTabelaComponent implements OnInit {
  fluxoPotencia: any[];
  cabecalho = Fluxo.cabecalho;

  constructor() { }

  ngOnInit() {
  }

}
