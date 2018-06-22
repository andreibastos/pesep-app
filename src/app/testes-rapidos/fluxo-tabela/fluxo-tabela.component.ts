import { Fluxo } from './../../models/fluxo';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fluxo-tabela',
  templateUrl: './fluxo-tabela.component.html',
  styleUrls: ['./fluxo-tabela.component.css']
})
export class FluxoTabelaComponent implements OnInit {
  @Input() fluxoPotencia: Array<any> = new Array();
  cabecalho = Fluxo.cabecalho;

  constructor() { }

  ngOnInit() {
    console.log(this.fluxoPotencia);
  }

}
