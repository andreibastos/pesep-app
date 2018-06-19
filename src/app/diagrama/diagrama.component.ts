import { Component, OnInit } from '@angular/core';

// Bibliotecas externas
import * as $ from 'jquery';
import * as interact from 'interactjs';
import * as SVG from 'svg.js';

// Classes Internas
import { IComponente, Carga, Fonte, Gerador, EnumBar } from '../models/componente';
import { SVGIcone } from './svg-icones';
import { Barra } from './models/barra';
import { Linha } from './models/linha';

@Component({
  selector: 'app-diagrama',
  templateUrl: './diagrama.component.html',
  styleUrls: ['./diagrama.component.css']
})

export class DiagramaComponent implements OnInit {
  // Elementos do Sistema Elétrico de Potência
  private barras: Array<Barra> = new Array();
  private linhas: Array<Linha> = new Array();
  private slack: Barra = null;

  // Controle de identificação
  private qtd_barras_tipo = {};
  private qtd_barras_total = 0;
  private enumerador_barra = EnumBar; // para usar no HTML

  // Controle do SVG
  container: SVG.Doc;
  mapa_SVG_grupos: Map<string, SVG.G> = new Map();
  selections: SVG.Set;
  div_name = 'draw_inside';
  selected: SVG.G;

  // Propriedades do Diagrama
  proprieties = { view_grid: true, snap_grid: false }; // Propriedades do diagrama
  show_proprieties = { diagram: true, bus_PV: false, bus_PQ: false, bus_VT: false }; // Qual Propriedade Exibir

  // Ferramenta selecionada
  tool_selected = { selected: true, move: false };

  constructor() {
    this.qtd_barras_tipo[EnumBar.VT] = 0;
    this.qtd_barras_tipo[EnumBar.PQ] = 0;
    this.qtd_barras_tipo[EnumBar.Slack] = 0;
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
    this.configureKeyDowns();
  }

  incrementaBarra(tipo: EnumBar) {
    this.qtd_barras_tipo[tipo]++;
    this.qtd_barras_total++;
  }

  adicionarBarra(tipo: EnumBar, posicao_x?: number, posicao_y?: number) {
    // Sistema Elétrico de Potência
    const barra: Barra = new Barra(tipo); // cria uma nova barra com o tipo associado
    barra.id_barra = `barra_${this.qtd_barras_total}`; // atualiza o identificador
    barra.nome = `Barra ${this.qtd_barras_total}`; // Atualiza o nome
    this.incrementaBarra(barra.tipo); // incremmenta o numero de barras
    this.barras.push(barra); // adiciona na lista

    // SVG
    let grupo = this.criaSVGBarra(tipo)
      .id(barra.id_barra)
      .move(posicao_x || 0, posicao_y || 0) // move para a posição desejada
      .data('barra', barra); // adiciona o dado da barra
    grupo = this.atualizaTextoGrupoBarra(grupo);
    this.mapa_SVG_grupos.set(grupo.id(), grupo);
  }

  criaSVGBarra(tipo: EnumBar): SVG.G {
    const node = this.container;
    const group = node.group().size(100, 100);
    const self = this;
    if (tipo === EnumBar.Slack || tipo === EnumBar.VT) {
      const circle = node.circle(50).move(2, 25).fill('#FFF').stroke({ width: 2 }).stroke('#000');
      const line_horizontal = node.line(52, 50, 95, 50).stroke({ width: 2 }).stroke('#000');
      const line_vertical = node.line(95, 10, 95, 90).stroke({ width: 5 }).stroke('#000');
      const text = node.text(name === 'PV' ? '~' : '∞').font({ size: 50, family: 'Times New Roman' }).move(10, 20);
      group.add(circle);
      group.add(line_horizontal);
      group.add(line_vertical);
      group.add(text);
    } else if (tipo === EnumBar.PQ) {
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
      });

    return group;
  }

  atualizaTextoGrupoBarra(grupo: SVG.G): SVG.G {
    const barra: Barra = grupo.data('barra') as Barra;
    const self = this;

    // TEM Q PENSAR ONDE VAI FICAR A POSIÇÃO DE CADA ITEM DA BARRA
    // grupo
    //   .text(a.name)
    //   .style('cursor', 'select')
    //   .dx(component.x())
    //   .dy(component.y() - 50);

    grupo = this.addRectSelecion(grupo);
    return grupo;
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
    this.addSelect();

  }

  configureKeyDowns() {
    const self = this;
    $(document).keydown(function (e) {
      if (e.ctrlKey) {
        if (e.keyCode === 65) {
          self.container.each(function (c) {
            if (c > 1) {
              self.addSelected(this);
            }
          });
        }
      }
    });
  }


  addSelect() {
    if (this.selections.length() === 1) {
      this.selected = this.selections.get(0).data('data');
    } else {
      this.selected = null;
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
    this.addSelect();
  }

  positionDataComponent(component: SVG.G) {
    const a: IComponente = component.data('data');
    const self = this;
    component
      .text(a.name)
      .style('cursor', 'select')
      .dx(component.x())
      .dy(component.y() - 50);
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

      })
      .on('dragmove', function (event) {
        if (self.selections.length() > 0) {
          self.selections.each(function (index) {
            const element = self.selections.get(index);
            element.dx(event.dx).dy(event.dy);
          });
        } else {
          self.mapa_SVG_grupos
            .get(event.target.id)
            .dx(event.dx)
            .dy(event.dy);
        }

      })
      .on('dragend', function (event) {
      });
  }

  add(name: string) {
    const newComponent: IComponente = this.getNewBus(name);
    this.qtd_barras_tipo[newComponent.type]++;
    newComponent.id = this.qtd_barras_total;
    newComponent.name += ' ' + this.qtd_barras_tipo[newComponent.type];
    // this.dict_nodes.set(newComponent.id, newComponent);
    this.qtd_barras_total++;

    let node = this.createNode(name)
      .data('data', newComponent)
      .id(newComponent.name);
    this.positionDataComponent(node);
    node = this.addRectSelecion(node);
    this.mapa_SVG_grupos.set(node.id(), node);
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

  // getNodes(): Array<IComponente> {
  //   // return this.nodes;
  //   return Array.from(this.dict_nodes.values()); // retornar um interable
  // }

  // getNode(id: number): IComponente {
  //   // return this.dict_nodes.get(id);
  // }


}
