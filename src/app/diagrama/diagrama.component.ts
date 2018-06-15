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
  dict_svg_elements: Map<string, SVG.G> = new Map();
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


    this.add('PQ');
  }

  addSelected(component: SVG.G) {
    if (this.selections.has(component)) {
      this.removeSelected(component);
    } else {
      component.last()
        .fill({ opacity: 0.08 })
        .stroke({ color: 'blue', opacity: 0.1, width: 1 });
      this.selections.add(component);
    }
  }

  resetSelection() {
    const self = this;
    this.container.each(function (c) {
      if (c > 1) {
        self.removeSelected(this);
      }

    });
    this.selections = this.container.set();

  }
  removeSelected(component: SVG.G) {
    component.last()
      .fill({ opacity: 0 })
      .stroke({ width: 0 });
    this.selections.remove(component);
  }

  positionDataComponent(component: SVG.G) {
    const a: IComponente = component.data('data');
    const self = this;
    component
      .text(a.name)
      .style('cursor', 'select')
      .click(function (event) {
        // const eu: SVG.Element = this;

        // const box = eu.bbox();

        // const p = eu.parent() as SVG.G;


        // const form = document.createElement('foreignObject');
        // form.setAttribute('x', '50');
        // form.setAttribute('y', '50');
        // form.setAttribute('width', '300');
        // form.setAttribute('height', '25');
        // const formulario = document.createElement('xhtml:form');
        // const input = document.createElement('input');
        // input.setAttribute('value', 'andrei');
        // formulario.appendChild(input);
        // form.appendChild(formulario);

        // console.log(form);
        // p.node.appendChild(form);
        // console.log(p);


      })
      .dx(component.x())
      .dy(component.y() - 50);
    // console.log(a);
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
    }).styleCursor(false).on('tap', function () { self.resetSelection(); });

    function dragstart(event) {
      x = event.interaction.pointers[0].offsetX;
      y = event.interaction.pointers[0].offsetY;
      box = self.container.rect(0, 0)
        .move(x, y)
        .id('rect_selection')
        .stroke({ width: 1, dasharray: '5, 5' })
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
      self.resetSelection();
      self.container.each(function (c) {
        const component: SVG.G = this;
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
    // interact('.component-simple')
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
        // // console.log(event.target, 'dragmove');
        if (self.selections.length() > 0) {
          self.selections.each(function (index) {
            const element = self.selections.get(index);
            // console.log(element);
            element.dx(event.dx).dy(event.dy);
          });
        } else {
          self.dict_svg_elements
            .get(event.target.id)
            .dx(event.dx)
            .dy(event.dy);
        }

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

    let node = this.createNode(name)
      .data('data', newComponent)
      .id(newComponent.name);
    this.positionDataComponent(node);
    node = this.addRectSelecion(node);
    this.dict_svg_elements.set(node.id(), node);
    console.log(node.last());

    return newComponent;
  }

  createNode(name: string): SVG.G {
    const node = this.container;
    const group = node.group().size(100, 100);
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
          self.resetSelection();
        }
      })
      .animate(200)
      .move(this.container.width() / 2, this.container.height() / 2);

    return group;
  }

  addRectSelecion(group: SVG.G) {
    // const box = group.bbox();
    const rect = this.container.rect(group.width(), group.height())
      .addClass('selected')
      .fill({ color: 'blue', opacity: 0 });
    group.add(rect);
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

  update(positionDataComponent: IComponente) {
    // this.dict_nodes[positionDataComponent;
  }

  getNodes(): Array<IComponente> {
    // return this.nodes;
    return Array.from(this.dict_nodes.values()); // retornar um interable
  }

  getNode(id: number): IComponente {
    return this.dict_nodes.get(id);
  }


}
