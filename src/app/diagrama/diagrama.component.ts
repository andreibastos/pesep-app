import { Component, OnInit } from '@angular/core';

// Bibliotecas externas
import * as $ from 'jquery';
import * as interact from 'interactjs';
import * as SVG from 'svg.js';

// Classes Internas
import { IComponente, Carga, Fonte, Gerador, EnumBar } from '../models/componente';
import { SVGIcone } from './svg-icones';
import { svg } from 'd3';

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

  selections: SVG.Set;

  div_name = 'draw_inside';


  constructor() {
    this.count_components[EnumBar.VT] = 0;
    this.count_components[EnumBar.PQ] = 0;
    this.count_components[EnumBar.Slack] = 0;
  }

  ngOnInit(): void {
    const draw_inside = document.getElementById('draw_inside');
    // Obtém as medidas da tela
    const height = draw_inside.clientHeight;
    const width = draw_inside.clientWidth;

    this.container = SVG(this.div_name)
      .addClass('svg_area')
      .size(width, height);

    this.selections = this.container.set();

    this.enableSelection();

    this.initInteract();

    SVGIcone.createBus('bus_vt', 'VT');
    SVGIcone.createBus('bus_pv', 'PV');
    SVGIcone.createBus('bus_pq', 'PQ');
    SVGIcone.createBus('curto_circuito', 'short');

  }

  addSelected(component: SVG.Element) {

    if (this.selections.has(component)) {
      this.removeSelected(component);
    } else {
      component.fill({ opacity: 0.3 });
      this.selections.add(component);
      console.log(component);
    }
  }

  resetSelecteds() {
    this.selections = this.container.set();
    this.container.each(function (c) {
      if (c > 1) {
        this.fill({ opacity: 1 });
      }
    });
  }
  removeSelected(component: SVG.Element) {
    this.selections.remove(component);
    component.fill({ opacity: 1 });
  }

  enableSelection() {
    const self = this;
    let box_x = 1, box_y = 1;


    let box: SVG.Element, x = 0, y = 0, dx, dy;
    const mask_selection = this.container
      .rect(this.container.width(), this.container.height())
      .fill({ color: 'transparent' })
      .id('mask_selection');
    interact(document.getElementById('mask_selection')).draggable({
      onstart: dragstart,
      onmove: dragmove,
      onend: dragend
    }).styleCursor(false).on('tap', function () { self.resetSelecteds(); });

    function dragstart(event) {
      x = event.interaction.pointers[0].offsetX;
      y = event.interaction.pointers[0].offsetY;
      box = self.container.rect(0, 0)
        .move(x, y)
        .id('rect_selection')
        .stroke({ width: 5 })
        .stroke('blue')
        .fill({ color: 'rgb(255, 255, 255)', opacity: 0 });
    }
    function dragmove(event) {
      dx = event.interaction.pointers[0].offsetX - x;
      dy = event.interaction.pointers[0].offsetY - y;
      let offsetX = 0, offsetY = 0;
      box_x = 1;
      box_y = 1;

      if (dx < 0) {
        offsetX = dx;
        dx *= -1;
        box_x = -1;
      }
      if (dy < 0) {
        offsetY = dy;
        dy *= -1;
        box_y = -1;

      }

      box.transform({ x: offsetX, y: offsetY });
      box.width(dx)
        .height(dy);
    }

    function dragend(event) {
      let bounds = box.bbox();
      bounds = fixBounds(bounds);
      box.remove();
      self.resetSelecteds();
      self.container.each(function (c) {
        const component: SVG.Element = this;
        if (c > 1) {
          const mybounds: SVG.BBox = component.bbox();
          mybounds.x += component.x();
          mybounds.y += component.y();
          // console.log(mybounds, bounds);
          if (mybounds.x >= bounds.x && mybounds.x <= bounds.x2 || mybounds.x2 >= bounds.x && mybounds.x2 <= bounds.x2) {
            if (mybounds.y >= bounds.y && mybounds.y <= bounds.y2 || mybounds.y2 >= bounds.y && mybounds.y2 <= bounds.y2) {
              self.addSelected(this);
            }
          }
        }
      });
    }

    function fixBounds(bounds: SVG.BBox) {
      if (box_x === -1) {
        bounds.x2 = bounds.x;
        bounds.x -= bounds.width;
      }
      if (box_y === -1) {
        bounds.y2 = bounds.y;
        bounds.y -= bounds.width;
      }
      return bounds;
    }


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

    return newComponent;
  }

  createNode(name: string): SVG.Element {
    const node = this.container;
    const group = node.group();
    const self = this;
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

    }
    group.addClass('component-simple')
      .click(function (event) {
        if (event.ctrlKey || event.shiftKey) {
          self.addSelected(this);
        } else {
          self.resetSelecteds();
        }
      })
      .animate(500)
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
