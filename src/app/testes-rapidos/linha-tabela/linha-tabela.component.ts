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
  }

  ngOnInit() {

  }
}
