import { Component, OnInit } from '@angular/core';
import { Barra } from '../../models/barra';

@Component({
  selector: 'app-barra-tabela',
  templateUrl: './barra-tabela.component.html',
  styleUrls: ['./barra-tabela.component.css']
})
export class BarraTabelaComponent implements OnInit {

  cabecalho: Array<string>;

  barras: Array<Barra> = [];

  constructor() {
    this.cabecalho = Barra.cabecalho;
    const barra1: Barra = new Barra(1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1);
    const barra2: Barra = new Barra(2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2);
    this.barras.push(barra1);
    this.barras.push(barra2);
    console.log(this.barras);
  }

  ngOnInit() {
    console.log(this.barras);

  }

}
