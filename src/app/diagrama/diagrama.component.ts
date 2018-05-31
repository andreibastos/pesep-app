import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import * as interact from 'interactjs';
import * as SVG from 'svg.js';
import { SVGIcone } from './svg-icones';


import { DiagramaSEP } from '../models/diagramaSEP';
@Component({
  selector: 'app-diagrama',
  templateUrl: './diagrama.component.html',
  styleUrls: ['./diagrama.component.css']
})
export class DiagramaComponent implements OnInit {

  // tamanho da grade
  grid_x = 10;
  grid_y = 10;

  diagrama: DiagramaSEP; // objeto que ficará as barras e as linhas

  constructor() {


  }

  createIconsSiderBar() {
    SVGIcone.createBus('bus_pv', 'PV');
    SVGIcone.createBus('bus_vt', 'VT');
    SVGIcone.createBus('bus_pq', 'PQ');
  }

  // evento comum de mover elementos do pacote interact.js
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

  // quando o seletor do diagrama é criado
  ngOnInit() {

    this.createIconsSiderBar();

    let clone = document.createElement('div');

    // configuração dos componentes do siderbar
    const component_fixed = interact('.component-fixed')
      .draggable({
        // enable inertial throwing
        inertia: true,
        // // keep the element within the area of it's parent
        // restrict: {
        //   restriction: document.getElementById('component-sidebar'),
        //   endOnly: true,
        //   elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        // },
        // enable autoScroll
        autoScroll: true
      })
      .on('dragstart', function (event) {
        clone = event.currentTarget.cloneNode(true);
        event.interaction.x = parseInt(event.target.getAttribute('data-x'), 10) || 0;
        event.interaction.y = parseInt(event.target.getAttribute('data-y'), 10) || 0;
      })
      .on('dragmove', this.dragmove)
      .on('dragend', function (event) {
        console.log(event);
        // event.target.setAttribute('data-x', event.interaction.x);
        // event.target.setAttribute('data-y', event.interaction.y);
      });

    // configuração dos componentes do diagrama
    const component_diagram = interact('.component-diagram')
      .draggable({
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
          restriction: document.getElementById('draw_inside'),
          endOnly: false,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        // enable autoScroll
        autoScroll: true,

        snap: {
          targets: [interact['createSnapGrid']({
            x: this.grid_x, y: this.grid_y
          })]
        }
      })
      .on('dragstart', function (event) {

      })
      .on('dragmove', this.dragmove)
      .on('dragend', function (event) {

      })
      ;




    // configuração da zona do diagrama
    const dropozone_diagram = interact('.dropzone-diagram').dropzone({
      // only accept elements matching this CSS selector
      accept: '#bus_pv, #bus_vt, #bus_pq',
      // Require a 75% element overlap for a drop to be possible
      overlap: 0.1,

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
        console.log(clone);
      },
      ondropdeactivate: function (event) {
        // remove active dropzone feedback
        event.target.classList.remove('drop-active');
        event.target.classList.remove('drop-target');
      }
    });
  }

}
