import { Component, OnInit } from '@angular/core';

// Bibliotecas externas
import * as $ from 'jquery';
import * as interact from 'interactjs';
import * as SVG from 'svg.js';

// Classes Internas
import { IComponente, Carga, Fonte, Gerador, EnumBar } from '../models/componente';
import { SVGIcone } from './svg-icones';

@Component({
  selector: 'app-diagrama',
  templateUrl: './diagrama.component.html',
  styleUrls: ['./diagrama.component.css']
})

export class DiagramaComponent implements OnInit {
  nodes: Array<IComponente> = new Array();
  links = [];
  dict_nodes: Map<number, IComponente> = new Map();
  container: SVG.Doc;
  dict_svg_elements: Map<string, SVG.Element> = new Map();
  count_components = {};

  // Propriedades do Diagrama
  proprieties = { view_grid: true, snap_grid: false }; // Propriedades do diagrama
  show_proprieties = { diagram: true, bus_PV: false, bus_PQ: false, bus_VT: false }; // Qual Propriedade Exibir

  // Ferramenta selecionada
  tool_selected = { selected: true, move: false };
  count = 0;

  constructor() {
    this.count_components[EnumBar.VT] = 0;
    this.count_components[EnumBar.PQ] = 0;
    this.count_components[EnumBar.Slack] = 0;
  }

  ngOnInit(): void {
    const div = 'draw_inside';
    const draw_inside = document.getElementById('draw_inside');
    // Obtém as medidas da tela
    const height = draw_inside.clientHeight;
    const width = draw_inside.clientWidth;

    this.container = SVG(div)
      .size(width, height);

    this.initInteract();

  }


  initInteract() {
    const self = this;
    interact('.component-simple')
      .draggable({
        inertia: true, // enable inertial throwing
        autoScroll: true, // enable autoScroll
        // keep the element within the area of draw_inside
        restrict: {
          restriction: document.getElementById(this.container.id()),
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        }
      })
      .on('dragstart', function (event) {
        // console.log(event.target, 'dragstart');
        // console.log(self.dict_svg_elements);

      })
      .on('dragmove', function (event) {
        // console.log(event.target, 'dragmove');
        self.dict_svg_elements
          .get(event.target.id)
          .dx(event.dx)
          .dy(event.dy);
      })
      .on('dragend', function (event) {
        // console.log(event.target, 'dragend');
        // console.log(self.dict_svg_elements);

      });
  }

  add(name: string) {
    const newComponent: IComponente = this.getNewBus(name);
    this.count_components[newComponent.type]++;
    newComponent.id = this.count;
    newComponent.name += ' ' + this.count_components[newComponent.type];
    this.dict_nodes.set(newComponent.id, newComponent);
    this.count++;

    const node = this.createNode(name)
      .id(newComponent.name);
    this.dict_svg_elements.set(node.id(), node);
    console.log(this.dict_svg_elements.get(node.id()));

    return newComponent;
  }

  createNode(name: string): SVG.Element {
    const node = this.container;
    const group = node.group();
    if (name === 'PV' || name === 'VT') {
      const circle = node.circle(50).move(2, 25).fill('#FFF').stroke({ width: 2 }).stroke('#000');
      const line_horizontal = node.line(52, 50, 95, 50).stroke({ width: 2 }).stroke('#000');
      const line_vertical = node.line(95, 10, 95, 90).stroke({ width: 5 }).stroke('#000');
      const text = node.text(name === 'PV' ? '~' : '∞').font({ size: 50, family: 'Times New Roman' }).move(10, 20);
      group.add(circle);
      group.add(line_horizontal);
      group.add(line_vertical);
      group.add(text);

    } else if (name === 'PQ') {
      const line_horizontal = node.line(20, 50, 95, 50).stroke({ width: 2 }).stroke('#000');
      const line_vertical = node.line(95, 10, 95, 90).stroke({ width: 5 }).stroke('#000');
      const triangule = node.path('m25,60l10,-25l10,25l-10,0l-10,0z')
        .rotate(-90, 25, 60);
      group.add(line_horizontal);
      group.add(line_vertical);
      group.add(triangule);
      // group.rotate(180);
      console.log(group);

    }
    group.addClass('component-simple')
      .move(this.container.width() / 2, this.container.height() / 2);
    return group;

  }

  getNewBus(name: string) {
    if (name === 'PV') {
      return new Gerador();
    }
    if (name === 'PQ') {
      return new Carga();
    }
    if (name === 'VT') {
      return new Fonte();
    }
  }

  update(updateComponent: IComponente) {
    this.dict_nodes[updateComponent.id] = updateComponent;
    // this.nodes[updateComponent.id] = updateComponent;
  }

  getNodes(): Array<IComponente> {
    // return this.nodes;
    return Array.from(this.dict_nodes.values()); // retornar um interable
  }

  getNode(id: number): IComponente {
    return this.dict_nodes.get(id);
  }


}
