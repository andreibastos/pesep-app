import { Component, OnInit } from '@angular/core';
import * as Raphael from 'raphael';
import * as $ from 'jquery';

import { DiagramaSEP } from '../models/diagramaSEP';
@Component({
  selector: 'app-diagrama',
  templateUrl: './diagrama.component.html',
  styleUrls: ['./diagrama.component.css']
})
export class DiagramaComponent implements OnInit {

  paper: any;

  diagrama: DiagramaSEP;

  constructor() { }

  ngOnInit() {
    const y = $('#draw_inside').height();
    const x = $('#draw_inside').width();
    console.log(x, y);


    this.diagrama = new DiagramaSEP();

    this.drawSEP(this.diagrama, x, y);

  }

  drawSEP(diagrama: DiagramaSEP, x, y) {
    console.log(diagrama);

    Raphael.st.draggable = function () {
      let lx, ly, ox = 0, oy = 0;
      const me = this,
        moveFnc = function (dx, dy) {
          lx = dx + ox;  // add the new change in x to the drag origin
          ly = dy + oy;  // do the same for y
          me.transform('t' + lx + ',' + ly);

        },
        startFnc = function () {
          me.animate({ 'opacity': 1, 'stroke-width': 2 }, 500);

        },
        endFnc = function () {
          ox = lx;
          oy = ly;
          me.animate({ 'opacity': 1, 'stroke-width': 1 }, 200);
        };

      this.drag(moveFnc, startFnc, endFnc);

    };


    this.paper = Raphael(document.getElementById('canvas_container'), x, y);
    const st = this.paper.set();
    st.push(
      this.paper.circle(x / 2, y / 2, 150).attr('fill', 'white')
    );

    st.attr('cursor', 'move');

    st.draggable();


  }

  calcularFluxo() {
    alert('fluxo calculado');
  }


}
