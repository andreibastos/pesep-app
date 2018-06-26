import { Component, OnInit, Input } from '@angular/core';
import { Sistema } from '../models/sistema';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css']
})
export class ResultadosComponent implements OnInit {

  constructor() { }

  @Input()
  sistema: Sistema;

  nav_active = 'linhas';

  selecionado: any[];

  ngOnInit() {

  }

  TrocarNav(nome: string) {
    this.nav_active = nome;
    console.log(this.sistema[nome]);
  }

}
