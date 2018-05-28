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


    this.paper = Raphael(document.getElementById('canvas_container'), x, y);
    const st = this.paper.set();
    st.push(
      this.paper.circle(x / 2, y / 2, 50),
      this.paper.circle(x / 2, y / 2, 75).attr('fill', 'red'),
      this.paper.circle(x / 2, y / 2, 100),
      this.paper.circle(x / 2, y / 2, 150)
    );



    // diagrama.nodes.forEach(node => {


    // });

    const inicio = function dragStart(dragC) {
      console.log(dragC);
      // Get original position of element, and set as properties .ox and .oy
      dragC.ox = dragC.attr('cx');
      dragC.oy = dragC.attr('cy');
      dragC.animate({ 'transform': 's2', 'fill': 'pink', 'opacity': 0.9 }, 200);
    };

    const move = function dragMove(dx, dy, dragC) {
      console.log(dragC);
      dragC.attr({ 'transform': 's1.6', 'fill': 'pink', 'opacity': 0.8, 'cx': dragC.ox + dx, 'cy': dragC.oy + dy });
    };

    const fim = function dragEnd(dragC) {
      console.log(dragC);
      dragC.animate({ 'transform': 's1', 'fill': 'white', 'opacity': 1 }, 500);
    };

    st.drag(move, inicio, fim);




  }


}
