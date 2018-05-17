import { Linha } from './../../models/linha';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-linha-tabela',
  templateUrl: './linha-tabela.component.html',
  styleUrls: ['./linha-tabela.component.css']
})
export class LinhaTabelaComponent implements OnInit {


  cabecalho: Array<string>;

  @Input() linhas: Array<Linha> = [];

  constructor() {
    this.cabecalho = Linha.cabecalho;
    const linha1: Linha = new Linha(1, 1, 1, 0, 1, 1, 1);
    const linha2: Linha = new Linha(2, 2, 2, 0, 2, 2, 2);
    this.linhas.push(linha1);
    this.linhas.push(linha2);
  }

  ngOnInit() {

  }
}
