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
  enumerador_barra = EnumBar; // para usar no HTML

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
  tool_selected = { selected: true, move: false, line: true };
  de_barra: Barra;
  para_barra: Barra;

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

    const style = document.createElement('style');
    style.innerHTML = `.selecionado {
                    fill: blue;
                    fill-opacity: 0.1;
                    stroke: black;
                    stroke-opacity:0.6;
                    stroke-width:2;
                   }
                   .deselecionado {
                    fill-opacity: 0.0;
                   }
                   `;

    this.container = SVG(this.div_name)
      .addClass('svg_area')
      .size(width, height);
    this.container.node.appendChild(style);

    this.selections = this.container.set();

    this.enableSelection();

    this.initInteract();

    SVGIcone.createBus('bus_vt', 'VT');
    SVGIcone.createBus('bus_pv', 'PV');
    SVGIcone.createBus('bus_pq', 'PQ');
    SVGIcone.createBus('curto_circuito', 'short');


    // this.add('PQ');
    this.adicionarBarra(this.enumerador_barra.VT, 50, 100);
    // this.adicionarBarra(this.enumerador_barra.VT, 300, 100);
    // this.adicionarBarra(this.enumerador_barra.PQ, 600, 100);

    // this.adicionarBarra(this.enumerador_barra.PQ, 50, 300);
    // this.adicionarBarra(this.enumerador_barra.Slack, 300, 300);
    // this.adicionarBarra(this.enumerador_barra.PQ, 600, 300);


    // this.adicionarBarra(this.enumerador_barra.VT, 50, 500);
    // this.adicionarBarra(this.enumerador_barra.VT, 300, 500);
    this.adicionarBarra(this.enumerador_barra.PQ, 600, 500);


    this.configureKeyDowns();
  }

  incrementaBarra(tipo: EnumBar) {
    this.qtd_barras_tipo[tipo]++;
    this.qtd_barras_total++;
  }

  adicionarBarra(tipo: EnumBar, posicao_x?: number, posicao_y?: number) {
    const self = this;

    // Sistema Elétrico de Potência
    const barra: Barra = new Barra(tipo); // cria uma nova barra com o tipo associado
    barra.id_barra = `barra_${this.qtd_barras_total}`; // atualiza o identificador
    barra.nome = `Barra ${this.qtd_barras_total}`; // Atualiza o nome
    this.incrementaBarra(barra.tipo); // incremmenta o numero de barras
    this.barras.push(barra); // adiciona na lista

    // SVG
    const grupo_todo = this.criaGrupoTodo(barra, posicao_x, posicao_y);

    // Grupo do desenhos (circulos, linha, etc)
    const grupo_desenho = this.criaGrupoDesenho(tipo);
    grupo_todo.add(grupo_desenho);

    // Grupo de tenho (P,Q,V,T)
    const grupo_texto = this.criaGrupoTexto(grupo_todo);
    grupo_todo.add(grupo_texto);

    const grupo_selecao = this.criarGrupoSelecao(grupo_todo);

    grupo_todo.add(grupo_selecao);

    this.mapa_SVG_grupos.set(grupo_todo.id(), grupo_todo);

  }

  criarGrupoSelecao(grupo: SVG.G): SVG.G {
    const grupo_selecao = this.container.group().addClass('grupo_selecao').addClass('deselecionado');
    const box = grupo.bbox();
    grupo_selecao.rect(box.w, box.h).move(box.x, box.y);
    return grupo_selecao;
  }

  criaGrupoTodo(barra: Barra, posicao_x?: number, posicao_y?: number) {
    const self = this;
    const grupo = this.container.group()
      .id(barra.id_barra)
      .addClass('grupo_geral')
      .move(posicao_x || 0, posicao_y || 0) // move para a posição desejada
      .data('barra', barra) // adiciona o dado da barra
      .addClass('componente-barra')
      .click(function (event) {
        if (event.ctrlKey || event.shiftKey) {
          self.addSelected(this);
        } else if (self.tool_selected.line) {
          if (!self.de_barra) {
            self.de_barra = this.data('barra');
          } else {
            self.para_barra = this.data('barra');
            self.adicionarLinha(self.de_barra, self.para_barra);
            self.de_barra = null;
            self.para_barra = null;
          }
        } else {
          self.resetSelection();
        }
      });
    return grupo;
  }

  criaGrupoDesenho(tipo: EnumBar): SVG.G {
    const node = this.container;
    const group = node.group().size(100, 100);
    const self = this;
    if (tipo === EnumBar.Slack || tipo === EnumBar.VT) {
      const circle = node.circle(50).move(2, 25).fill('#FFF').stroke({ width: 2 }).stroke('#000');
      const line_horizontal = node.line(52, 50, 95, 50).stroke({ width: 2 }).stroke('#000');
      const line_vertical = node.line(95, 10, 95, 90).stroke({ width: 5 }).stroke('#000');
      const text = node.text(tipo === EnumBar.VT ? '~' : '∞').font({ size: 50, family: 'Times New Roman' }).move(10, 20);
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
    group.addClass('grupo_desenho');
    return group;
  }

  criaGrupoTexto(grupo: SVG.G): SVG.G {
    const barra: Barra = grupo.data('barra') as Barra;
    const self = this;
    const box = grupo.bbox();
    const grupo_texto = this.container.group();
    // TEM Q PENSAR ONDE VAI FICAR A POSIÇÃO DE CADA ITEM DA BARRA
    grupo_texto.text(barra.nome)
      .id('nome')
      .dx(box.height * 0.7)
      .dy(box.width);

    grupo_texto.text(`P=${barra.pCarga} pu`)
      .id('P')
      .dx(-box.height * 0.1)
      .dy(-box.width * 0.3);

    grupo_texto.text(`Q=${barra.qCarga} pu`)
      .id('Q')
      .dx(-box.height * 0.1)
      .dy(-box.width * 0.1);

    grupo_texto.text(`${barra.tensao_0}∠${barra.angulo_0}° pu`)
      .id('VT')
      .dy(-box.width * 0.15)
      .dx(box.height * 0.7);
    return grupo_texto;
  }


  adicionarLinha(de: Barra, para: Barra, tipo?: string) {
    const rect = this.container.rect();
    const group_line = this.container.group().add(rect).id('line_1') as SVG.G;

    const de_grupo = this.mapa_SVG_grupos.get(de.id_barra);
    const de_grupo_box = de_grupo.bbox();
    const para_grupo = this.mapa_SVG_grupos.get(para.id_barra);
    const para_grupo_box = para_grupo.bbox();


    // console.log(de_grupo, para_grupo);

    let eixo_y: string, eixo_x: string;
    para_grupo_box.x2 += para_grupo.x();
    para_grupo_box.cy += para_grupo.y();

    de_grupo_box.x2 += de_grupo.x();
    de_grupo_box.cy += de_grupo.y();

    group_line.move(de_grupo_box.x2, de_grupo_box.cy);

    if ((para_grupo_box.x2) < de_grupo_box.x2) {
      eixo_x = 'esquerda';
    } else if (para_grupo_box.x2 > de_grupo_box.x2) {
      eixo_x = 'direita';
    } else {
      eixo_x = 'meio';
    }
    if (para_grupo_box.cy < de_grupo_box.cy) {
      eixo_y = 'acima';
    } else if (para_grupo_box.cy > de_grupo_box.cy) {
      eixo_y = 'abaixo';
    } else {
      eixo_y = 'meio';
    }

    if (eixo_x === 'esquerda') {
      const delta_y = para_grupo.cy() - de_grupo.cy();
      const delta_x = para_grupo_box.x2 - de_grupo_box.x2;


      group_line.polyline([[-de_grupo.width() * 0.4, 0], [10, 0]]);
      if (eixo_y === 'acima') {
        group_line.polyline([[10, 0], [10, delta_y]]);
      } else if (eixo_y === 'abaixo') {
        group_line.polyline([[10, 0], [10, delta_y]]);
      } else if (eixo_y === 'meio') {
        // group_line.polyline([[10, 0], [10, de_grupo.height() / 1.2]]);

      }

      group_line.polyline([[10, delta_y], [delta_x * 1.15, delta_y]]);


    }
    group_line.fill('black').stroke({ width: 2, color: 'black' });


  }

  addSelected(grupo: SVG.G) {
    if (this.selections.has(grupo)) {
      this.removeSelected(grupo);
    } else {
      const grupo_selecao = grupo.get(2) as SVG.G;
      if (grupo_selecao) {
        grupo_selecao.addClass('selecionado').removeClass('deselecionado');
      }

      this.selections.add(grupo);
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
      this.selected = this.selections.get(0).data('barra');
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
  removeSelected(grupo: SVG.G) {
    const grupo_selecao = grupo.get(2) as SVG.G;
    if (grupo_selecao) {
      grupo_selecao.addClass('deselecionado').removeClass('selecionado');
    }
    this.selections.remove(grupo);

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
      onend: dragend,
      restrict: {
        restriction: document.getElementById(this.container.id()),
      }
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
      const pointers = event.interaction.pointers[0];
      console.log(pointers);
      // if (pointers.target.id != "" ) {
      dx = event.interaction.pointers[0].offsetX - x;
      dy = event.interaction.pointers[0].offsetY - y;

      let transform_x = 0, transform_y = 0;
      box_x = 1;
      box_y = 1;

      if (dx < 0) {
        transform_x = dx;
        dx *= -1;
        box_x = -1;
      }
      if (dy < 0) {
        transform_y = dy;
        dy *= -1;
        box_y = -1;
      }

      box.transform({ x: transform_x, y: transform_y });
      box.width(dx)
        .height(dy);
      // }


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
    interact('.componente-barra')
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

    interact('.component-fixed')
      .draggable({
        inertia: true, // enable inertial throwing
        autoScroll: true, // enable autoScroll
        // keep the element within the area of draw_inside
        restrict: {
          restriction: document.getElementsByClassName('sidebar').item(0),
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        }
      })
      .on('dragstart', function (event) {
        event.interaction.x = parseInt(event.target.getAttribute('data-x'), 10) || 0;
        event.interaction.y = parseInt(event.target.getAttribute('data-y'), 10) || 0;
      })
      .on('dragmove', function (event) {

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

      })
      .on('dragend', function (event) { });


    interact('.dropzone-diagram').dropzone({
      overlap: 0.1
    });
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
    $('selected').each(function () {
      this.remove();
    });
    const rect = this.container.rect(group.width(), group.height())
      .addClass('selected')
      .fill({ color: 'blue', opacity: 0 });
    group.add(rect);
    return group;
  }



}
