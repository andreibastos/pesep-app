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
    this.TrocarNav(this.nav_active);
  }

  TrocarNav(campo: string) {
    this.nav_active = campo;
    this.selecionado = this.sistema.toTable(campo);
  }

}
