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


  // Configurações de Drag and Drop
  component_fixed; // interact with component fixed
  component_diagram; // interact with component fixed

  // Configuraçes de Zonas
  dropozone_diagram; // interact with zones

  // Itens Selecionados
  selecteds: any[] = new Array();

  // Propriedades do Diagrama
  proprieties = { view_grid: true, snap_grid: false }; // Propriedades do diagrama
  show_proprieties = { diagram: true, bus_PV: false, bus_PQ: false, bus_VT: false }; // Qual Propriedade Exibir

  // Ferramenta selecionada
  tool_selected = { selected: true, move: false };

  // Ajustes da grade
  grid_size_lines = 50; // Número de linhas
  grid_size_coluns = 50; // Número de colunas
  grid_dx; // Espaçamento em x
  grid_dy; // Espaçamento em y
  grid_svg; // Elemento DOM contendo a grade em SVG

  diagram: DiagramaSEP; // objetos que ficarão as barras e as linhas

  constructor() { }

  // ** Functions of Creation **

  // Criação dos icones dos componentes fixos
  CreateIconsSiderBar() {
    SVGIcone.createBus('bus_pv', 'PV');
    SVGIcone.createBus('bus_vt', 'VT');
    SVGIcone.createBus('bus_pq', 'PQ');
  }

  // Criação da grade de linhas
  CreateGridLines() {
    // Obtém as medidas da tela
    const height = document.getElementById('draw_inside').clientHeight;
    const width = document.getElementById('draw_inside').clientWidth;

    this.grid_dy = height / this.grid_size_lines;
    this.grid_dx = width / this.grid_size_coluns;

    // Cria o SVG em cima do elemento onde fica o desenho
    const draw_inside = SVG('draw_inside').size(width, height);
    draw_inside.id('grid_svg'); // Adiciona um ID
    const grid = draw_inside.set(); // Cria um grupo de grid

    const lines = draw_inside.set(); // Cria um grupo de lines
    const columns = draw_inside.set(); // Cria um grupo de columns

    // Varre o número de linhas, prédeterminado no ínício
    for (let line = 0; line <= this.grid_size_lines; line++) {
      const line_draw = draw_inside.line(0, line * this.grid_dy, draw_inside.width(), line * this.grid_dy);
      if ((line) % 5 !== 0) { // Linhas escuras a cada 5 linhas
        line_draw.stroke('#b3b3b3d6');
      } else {
        line_draw.stroke('#787979');
      }
      lines.add(line_draw); // Adiona no grupo de linhas
    }

    // Varre o número de colunas, prédeterminado no ínício
    for (let column = 0; column <= this.grid_size_coluns; column++) {
      const line_draw = draw_inside.line(column * this.grid_dx, 0, column * this.grid_dx, draw_inside.height());
      if ((column) % 5 !== 0) { // Colunas escuras a cada 5 linhas
        line_draw.stroke('#b3b3b3d6');
      } else {
        line_draw.stroke('#787979');
      }
      columns.add(line_draw); // Adiciona no grupo de colunas
    }
    // grid.add(columns);
    this.grid_svg = document.getElementById('grid_svg'); // atualiza o grid DOM
  }

  // ** Functions of Changes **

  // Habilitar ou desabilitar grudar os componentes no grid
  ChangeSnapGrid() {
    // Configuração do Snap
    let targets = [];
    if (this.proprieties.snap_grid) {
      targets = [interact['createSnapGrid']({
        x: this.grid_dx, y: this.grid_dy
      })];
    }
    console.log(this.proprieties.snap_grid);
    this.component_diagram.options.drag.snap.targets = targets;
  }

  // Mudança de visibilidade do grid
  ChangeVisibilityGrid() {
    // if (this.proprieties.view_grid) {
    if (this.grid_svg.style.display === 'none') {
      this.grid_svg.style.display = 'block';
    } else {
      this.grid_svg.style.display = 'none';
    }
    // }
  }

  ChangeToolSelected(name) {
    if (name === 'selected') {
      this.tool_selected[name] = true;
      this.tool_selected['move'] = false;
    } else {
      this.tool_selected[name] = true;
      this.tool_selected['selected'] = false;
    }
  }

  // ** Function of Update **
  UpdateGridLines() {
  }

  // Functions of interaction

  addNewComponent(event) {
    console.log(event);
  }

  // Mover componentes na tela do pacote interact.js
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

  // Configura as interações iniciais
  ConfigueInteractionInit() {

    // Copiar o próprio seletor para passagem de parâmetro para outras funções
    const self = this;

    // Cria um clone, para copiar o componente a ser copiado
    let clone = document.createElement('div');

    // Configuração dos componentes do siderbar
    this.component_fixed = interact('.component-fixed')
      .draggable({
        inertia: true, // enable inertial throwing
        autoScroll: true // enable autoScroll
      })
      .on('dragstart', function (event) {
        clone = event.currentTarget.cloneNode(true);
        event.interaction.x = parseInt(event.target.getAttribute('data-x'), 10) || 0;
        event.interaction.y = parseInt(event.target.getAttribute('data-y'), 10) || 0;
      })
      .on('dragmove', this.dragmove)
      .on('dragend', function (event) {
      });

    // configuração dos componentes do diagrama
    this.component_diagram = interact('.component-diagram')
      .draggable({
        inertia: true,
        // keep the element within the area of draw_inside
        restrict: {
          restriction: document.getElementById('draw_inside'),
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        autoScroll: false, // enable autoScroll
        // snap
        snap: {
          relativePoints: [{ x: 0, y: 0 }],
          // range: 10,
          targets: [
            interact['createSnapGrid']({
              x: this.grid_dx, y: this.grid_dy
            })
          ],
        }
      })
      .on('dragstart', function (event) { })
      .on('dragmove', this.dragmove)
      .on('dragend', function (event) { })
      .on('tap', function (event) {
        event.currentTarget.classList.toggle('component-selected');
        event.preventDefault();
        self.selecteds.push(event.currentTarget);
      })
      ;




    // configuração da zona do diagrama
    this.dropozone_diagram = interact('.dropzone-diagram').dropzone({
      // only accept elements matching this CSS selector
      // accept: '#bus_pv, #bus_vt, #bus_pq',
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
      },
      ondragleave: function (event) {
        // remove the drop feedback style
        event.target.classList.remove('drop-target');
      },
      ondrop: function (event) {
        const component = event.relatedTarget;

        if (self.isBusNew(component)) {
          const bus = self.getNewBus(component);
          bus.x = component.getAttribute('data-x');
          bus.y = component.getAttribute('data-y');
          const newId = self.diagram.add(bus);


          component.classList.remove('component-fixed');
          component.classList.add('component-diagram');
          component.setAttribute('id', newId);
        } else {
          const bus = self.diagram.getNode(parseInt(component.id, 0));
          bus.x = component.getAttribute('data-x');
          bus.y = component.getAttribute('data-y');
          self.diagram.update(bus);
        }

        console.log(self.diagram.getNodes());


      },
      ondropdeactivate: function (event) {
        // remove active dropzone feedback
        event.target.classList.remove('drop-active');
        event.target.classList.remove('drop-target');
      }
    });
    this.ChangeSnapGrid();
  }

  isBusNew(component): boolean {
    if (component.classList.value.indexOf('component-fixed') !== -1) { return true; }
    return false;
  }

  getNewBus(component) {
    if (component.id === 'bus_pv') {
      // return new Modes
      return new Gerador();
    }
    if (component.id === 'bus_pq') {
      return new Carga();
    }
    if (component.id === 'bus_vt') {
      return new Fonte();
    }
  }

  // ** Lifecycle Hooks **

  // Quando o seletor é criado (similar ao document.ready)
  ngOnInit() {
    // criar um novo diagrama
    this.diagram = new DiagramaSEP();

    // Cria os icones da barra esquerdas, componentes fixos
    this.CreateIconsSiderBar();

    // Configuração das interações inicias
    this.ConfigueInteractionInit();

    // Criação das grade de linha
    this.CreateGridLines();
  }

  // ** Services **
  CalculePowerFlow() {
    console.log(this.diagram);
  }

}
