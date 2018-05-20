import { Component, OnInit, Input } from '@angular/core';
import { Barra } from '../../models/barra';

@Component({
  selector: 'app-barra-tabela',
  templateUrl: './barra-tabela.component.html',
  styleUrls: ['./barra-tabela.component.css']
})
export class BarraTabelaComponent implements OnInit {

  cabecalho: Array<string>;

  @Input() barras: Array<Barra> = [];

  constructor() {
    this.cabecalho = Barra.cabecalho;
  }

  ngOnInit() {

  }

}
