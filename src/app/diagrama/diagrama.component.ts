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

  // Configurações de Drag and Drop
  component_fixed; // interact with component fixed
  component_diagram; // interact with component fixed

  // Configuraçes de Zonas
  dropozone_diagram; // interact with zones

  // Itens Selecionados
  selecteds: any[] = new Array();

  // Propriedades do Diagrama
  proprieties = { view_grid: true, snap_grid: true }; // Propriedades do diagrama
  showProprieties = { diagram: true, bus_PV: false, bus_PQ: false, bus_VT: false }; // Qual Propriedade Exibir

  // Tamanho da grade
  grid_lines = 50;
  grid_coluns = 50;
  grid_x;
  grid_y;
  grid_svg;

  diagrama: DiagramaSEP; // objetos que ficarão as barras e as linhas

  constructor() {

  }

  // Criação dos icones dos componentes fixos
  createIconsSiderBar() {
    SVGIcone.createBus('bus_pv', 'PV');
    SVGIcone.createBus('bus_vt', 'VT');
    SVGIcone.createBus('bus_pq', 'PQ');
  }


  calcularFluxo() {
    console.log(this.diagrama);
  }

  proprietiesChange(event) {
    this.changeSnap();
    this.changeGrid();
  }

  changeGrid() {

    if (this.grid_svg.style.display === 'none') {
      this.grid_svg.style.display = 'block';
    } else {
      this.grid_svg.style.display = 'none';
    }
  }

  changeProperties() {
  }

  makeGrid() {
    const height = document.getElementById('draw_inside').clientHeight;
    const width = document.getElementById('draw_inside').clientWidth;
    const draw_inside = SVG('draw_inside').size(width, height);

    draw_inside.id('grid_svg');

    console.log(draw_inside);
    const grid = draw_inside.set();
    console.log(draw_inside.height());
    for (let linha = 0; linha <= draw_inside.height() / this.grid_y; linha++) {
      const line = draw_inside.line(0, linha * this.grid_y, draw_inside.width(), linha * this.grid_y);
      if ((linha) % 5 !== 0) {
        line.stroke('#b3b3b3d6');
      } else {
        line.stroke('#292929');
      }
      grid.add(line);
    }

    for (let coluna = 0; coluna < draw_inside.width() / this.grid_y; coluna++) {
      const line = draw_inside.line(coluna * this.grid_x, 0, coluna * this.grid_x, draw_inside.height());
      if ((coluna) % 5 !== 0) {
        line.stroke('#b3b3b3d6');
      } else {
        line.stroke('#292929');
      }
      grid.add(line);
    }
    console.log(grid);

    this.grid_svg = document.getElementById('grid_svg');

  }

  changeSnap() {
    // Configuração do Snap
    let targets = [];
    if (this.proprieties.snap_grid) {
      targets = [interact['createSnapGrid']({
        x: this.grid_x, y: this.grid_y
      })];
    }
    this.component_diagram.options.drag.snap.targets = targets;
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

  // Quando o seletor é criado (similar ao document.ready)
  ngOnInit() {

    const height = document.getElementById('draw_inside').clientHeight;
    const width = document.getElementById('draw_inside').clientWidth;

    this.grid_y = height / this.grid_lines;
    this.grid_x = width / this.grid_coluns;

    this.diagrama = new DiagramaSEP();

    const selector = this;

    this.createIconsSiderBar();
    this.changeProperties();

    let clone = document.createElement('div');

    // configuração dos componentes do siderbar
    this.component_fixed = interact('.component-fixed')
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
        // event.target.setAttribute('data-x', event.interaction.x);
        // event.target.setAttribute('data-y', event.interaction.y);
      });

    // configuração dos componentes do diagrama
    this.component_diagram = interact('.component-diagram')
      .draggable({
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
          restriction: document.getElementById('draw_inside'),
          endOnly: false,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        // enable autoScroll
        autoScroll: false,

        snap: {
          relativePoints: [{ x: 0, y: 0 }],
          range: 10,
          targets: [
            interact['createSnapGrid']({
              x: this.grid_x, y: this.grid_y, range: 50
            })
          ],

        }
      })
      .on('dragstart', function (event) {

      })
      .on('dragmove', this.dragmove)
      .on('dragend', function (event) {

      }).on('tap', function (event) {
        event.currentTarget.classList.toggle('component-selected');
        event.preventDefault();
        selector.selecteds.push(event.currentTarget);
        selector.changeProperties();
      })
      ;




    // configuração da zona do diagrama
    this.dropozone_diagram = interact('.dropzone-diagram').dropzone({
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
        // draggableElement.classList.add('can-drop');
      },
      ondragleave: function (event) {
        // remove the drop feedback style
        event.target.classList.remove('drop-target');
        // event.relatedTarget.classList.remove('can-drop');
      },
      ondrop: function (event) {
        event.relatedTarget.classList.remove('component-fixed');
        event.relatedTarget.classList.add('component-diagram');
        console.log(event.relatedTarget);
      },
      ondropdeactivate: function (event) {
        // remove active dropzone feedback
        event.target.classList.remove('drop-active');
        event.target.classList.remove('drop-target');
      }
    });

    this.makeGrid();
  }

}
