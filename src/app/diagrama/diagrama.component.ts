import { Component, OnInit } from '@angular/core';
import * as Raphael from 'raphael';
import * as $ from 'jquery';
import * as interact from 'interactjs';

import { DiagramaSEP } from '../models/diagramaSEP';
@Component({
  selector: 'app-diagrama',
  templateUrl: './diagrama.component.html',
  styleUrls: ['./diagrama.component.css']
})
export class DiagramaComponent implements OnInit {

  icons: any[] = [
    { name: '' }
  ];

  recebido = '';

  y_draw;
  x_draw;

  y_components;
  x_components;

  paper_draw: any;
  paper_components: any;

  diagrama: DiagramaSEP;


  constructor() { }

  dragmove(event) {

    const target = event.target,
      // keep the dragged position in the data-x/data-y attributes
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
      target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  ngOnInit() {
    const transformProp = '';
    let clone = document.createElement('div');
    const pixelSize = 10;
    // configuração dos componentes do siderbar
    const component_fixed = interact('.component-fixed')
      .draggable({
        // enable inertial throwing
        inertia: true,
        // // keep the element within the area of it's parent
        // restrict: {
        //   restriction: '.dropzone',
        //   endOnly: true,
        //   elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        // },
        // enable autoScroll
        autoScroll: true,

        // snap: {
        //   targets: [interact['createSnapGrid']({
        //     x: pixelSize, y: pixelSize
        //   })]
        // },
      })
      .on('dragstart', function (event) {
        clone = event.currentTarget.cloneNode(true);
        event.interaction.x = parseInt(event.target.getAttribute('data-x'), 10) || 0;
        event.interaction.y = parseInt(event.target.getAttribute('data-y'), 10) || 0;
      })
      .on('dragmove', this.dragmove)
      .on('dragend', function (event) {
        // event.target.setAttribute('data-x', event.interaction.x);
        // event.target.setAttribute('data-y', event.interaction.y);
      });

    const component_diagram = interact('.component-diagram')
      .draggable({
        // keep the element within the area of it's parent
        restrict: {
          restriction: document.getElementById('canvas_draw'),
          endOnly: false,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        // enable autoScroll
        autoScroll: true,

        // snap: {
        //   targets: [interact['createSnapGrid']({
        //     x: pixelSize, y: pixelSize
        //   })]
      })
      .on('dragstart', function (event) {

      })
      .on('dragmove', this.dragmove)
      .on('dragend', function (event) {

      })
      ;


    // enable draggables to be dropped into this
    const a = interact('.dropzone-diagram').dropzone({
      // only accept elements matching this CSS selector
      accept: '#yes-drop',
      // Require a 75% element overlap for a drop to be possible
      overlap: 0.75,

      // listen for drop related events:

      ondropactivate: function (event) {
        // add active dropzone feedback
        event.target.classList.add('drop-active');
      },
      ondragenter: function (event) {
        const draggableElement = event.relatedTarget,
          dropzoneElement = event.target;

        // feedback the possibility of a drop
        dropzoneElement.classList.add('drop-target');
        draggableElement.classList.add('can-drop');
      },
      ondragleave: function (event) {
        // remove the drop feedback style
        event.target.classList.remove('drop-target');
        event.relatedTarget.classList.remove('can-drop');
      },
      ondrop: function (event) {
        event.relatedTarget.classList.remove('component-fixed');
        event.relatedTarget.classList.add('component-diagram');
        // console.log(event);
      },
      ondropdeactivate: function (event) {
        // remove active dropzone feedback
        event.target.classList.remove('drop-active');
        event.target.classList.remove('drop-target');
      }
    });


    const y_draw = $('#draw_inside').height();
    const x_draw = $('#draw_inside').width();

    const x_components = $('#draw_components').width();
    const y_components = $('#draw_components').height();




    this.diagrama = new DiagramaSEP();

    this.drawSEP(this.diagrama, x_draw, y_draw);



  }

  drawSEP(diagrama: DiagramaSEP, x_draw, y_draw) {

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
    // console.log('drop', ev);
    this.recebido = JSON.stringify(ev);
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
