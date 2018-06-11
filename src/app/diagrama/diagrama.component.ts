import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import * as interact from 'interactjs';
import * as SVG from 'svg.js';

import { SVGIcone } from './svg-icones';
import { DiagramaSEP } from '../models/diagramaSEP';
import { Fonte } from '../models/fonte';
import { Carga } from '../models/carga';
import { Gerador } from '../models/gerador';

@Component({
  selector: 'app-diagrama',
  templateUrl: './diagrama.component.html',
  styleUrls: ['./diagrama.component.css']
})

export class DiagramaComponent implements OnInit {

  diagramaSEP: DiagramaSEP;
  // Propriedades do Diagrama
  proprieties = { view_grid: true, snap_grid: false }; // Propriedades do diagrama
  show_proprieties = { diagram: true, bus_PV: false, bus_PQ: false, bus_VT: false }; // Qual Propriedade Exibir

  // Ferramenta selecionada
  tool_selected = { selected: true, move: false };

  constructor() {

  }

  ngOnInit(): void {
    const draw_inside = document.getElementById('draw_inside');
    // Obtém as medidas da tela
    const height = draw_inside.clientHeight;
    const width = draw_inside.clientWidth;

    this.diagramaSEP = new DiagramaSEP('draw_inside', height, width);
  }

  add(name) {
    this.diagramaSEP.add(name);
  }

}
