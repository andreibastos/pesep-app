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

  y_draw;
  x_draw;

  y_components;
  x_components;

  paper_draw: any;
  paper_components: any;

  diagrama: DiagramaSEP;

  constructor() { }

  ngOnInit() {


    const y_draw = $('#draw_inside').height();
    const x_draw = $('#draw_inside').width();

    const x_components = $('#draw_components').width();
    const y_components = $('#draw_components').height();


    console.log(x_draw, y_draw);
    console.log(x_components, x_components);


    this.diagrama = new DiagramaSEP();

    this.drawSEP(this.diagrama, x_draw, y_draw);

  }

  drawSEP(diagrama: DiagramaSEP, x_draw, y_draw) {
    console.log(diagrama);

    Raphael.st.draggable = function () {
      let lx, ly, ox = 0, oy = 0;
      const me = this,
        moveFnc = function (dx, dy) {
          lx = dx + ox;  // add the new change in x_draw to the drag origin
          ly = dy + oy;  // do the same for y_draw
          me.transform('t' + lx + ',' + ly);

        },
        startFnc = function () {
          me.animate({ 'opacity': 1, 'stroke-width': 2 }, 500);

        },
        endFnc = function () {
          ox = lx;
          oy = ly;
          me.animate({ 'opacity': 1, 'stroke-width': 1 }, 200);
          console.log(me);
        };

      this.drag(moveFnc, startFnc, endFnc);

    };


    this.paper_draw = Raphael('canvas_draw', x_draw, y_draw);

    const st = this.paper_draw.set();
    st.push(
      this.paper_draw.circle(x_draw / 2, y_draw / 2, 150).attr('fill', 'white')
    );

    st.attr('cursor', 'move');

    st.draggable();

    // this.paper_components = Raphael('canvas_components', this.x_components, this.y_components);
    // const st2 = this.paper_components.set();
    // st2.push(
    //   this.paper_components.circle(this.x_components / 2, this.y_components / 2, 20).attr('fill', 'white')
    // );
    // st2.attr('cursor', 'move');

    // st2.draggable();
    // console.log(st2);

  }

  calcularFluxo() {
    alert('fluxo calculado');
  }


  allowDrop(ev) {
    // console.log('allow', ev);
    ev.preventDefault();
  }

  drag(ev) {
    // console.log('drag', ev);
    ev.dataTransfer.setData('text', ev.target.id);
  }

  drop(ev) {
    console.log('drop', ev);
    ev.preventDefault();
    const data = ev.dataTransfer.getData('text');
    const st = this.paper_draw.set();
    st.push(
      this.paper_draw.rect(ev['x'], ev['y'], 150, 20).attr('fill', 'black ')
    );

    st.attr('cursor', 'move');

    st.draggable();

  }


}
