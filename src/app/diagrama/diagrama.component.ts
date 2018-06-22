import { EnumLinhaTipo } from './../models/componente';
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
  div_nome = 'draw_inside';
  container: SVG.Doc;
  mapa_SVG_grupos: Map<string, SVG.G> = new Map();
  selecionados: SVG.Set;
  selecionado: SVG.G;

  // Temporário
  de_barra: Barra;
  para_barra: Barra;

  // Propriedades do Diagrama
  propriedades_diagrama = { visualizar_grade: true, agarrar_grade: false }; // Propriedades do diagrama
  mostrar_propriedades = { diagram: true, bus_PV: false, bus_PQ: false, bus_VT: false }; // Qual Propriedade Exibir

  // Ferramenta selecionada
  ferramenta_atual = { selecionado: true, mover: false, linha: false };

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

    // const style_svg = document.createElement('style');
    // style_svg.setAttribute('href', './assets/css/svg.css');
    // style_svg.setAttribute('rel', 'stylesheet');
    // style_svg.type = 'text/css';

    const style_svg = document.createElementNS('http://www.w3.org/2000/svg', 'style');

    // Now (ab)use the @import directive to load make the browser load our css
    style_svg.textContent = '@import url("./assets/css/svg.css");';

    console.log(style_svg);

    this.container = SVG(this.div_nome)
      .addClass('svg_area')
      .size(width, height);
    this.container.node.appendChild(style_svg);

    this.selecionados = this.container.set();

    this.habilitarSelecao();
    this.habilitarRotacao();
    this.habilitarAdicionarLinha();
    this.inicializarInteract();

    this.configurarAtalhos();


    SVGIcone.createBus('bus_vt', 'VT');
    SVGIcone.createBus('bus_pv', 'PV');
    SVGIcone.createBus('bus_pq', 'PQ');
    SVGIcone.createBus('curto_circuito', 'short');


    // this.add('PQ');
    this.adicionarBarra(this.enumerador_barra.VT, 50, 100);
    // this.adicionarBarra(this.enumerador_barra.VT, 300, 100);
    // this.adicionarBarra(this.enumerador_barra.PQ, 600, 100);

    // this.adicionarBarra(this.enumerador_barra.PQ, 50, 300);
    this.adicionarBarra(this.enumerador_barra.Slack, 300, 300);
    // this.adicionarBarra(this.enumerador_barra.PQ, 600, 300);


    // this.adicionarBarra(this.enumerador_barra.VT, 50, 500);
    // this.adicionarBarra(this.enumerador_barra.VT, 300, 500);
    this.adicionarBarra(this.enumerador_barra.PQ, 600, 500);

    this.adicionarLinha(this.barras[0], this.barras[1], EnumLinhaTipo.reta);
    // this.adicionarLinha(this.barras[1], this.barras[2], EnumLinhaTipo.reta);
    // this.adicionarLinha(this.barras[1], this.barras[3], EnumLinhaTipo.reta);
  }

  /*
  FUNÇÕES DO SISTEMA ELÉTRICO DE POTÊNCIA
  */

  adicionarBarra(tipo: EnumBar, posicao_x?: number, posicao_y?: number) {
    const self = this;

    // Sistema Elétrico de Potência
    const barra: Barra = new Barra(tipo); // cria uma nova barra com o tipo associado
    barra.id_barra = `barra_${this.qtd_barras_total}`; // atualiza o identificador
    barra.nome = `Barra ${this.qtd_barras_total}`; // Atualiza o nome
    this.incrementaBarra(barra.tipo); // incremmenta o numero de barras
    this.barras.push(barra); // adiciona na lista

    // SVG
    const grupo_barra = this.criaGrupoBarra(barra, posicao_x, posicao_y);

    // Grupo do desenhos (circulos, linha, etc)
    const grupo_barra_desenho = this.criaGrupoBarraDesenho(tipo);
    grupo_barra.add(grupo_barra_desenho);

    // Grupo de tenho (P,Q,V,T)
    const grupo_texto = this.criaGrupoBarraTexto(grupo_barra);
    grupo_barra.add(grupo_texto);

    const grupo_barra_selecao = this.criarGrupoBarraSelecao(grupo_barra);

    grupo_barra.add(grupo_barra_selecao);
    grupo_barra.addClass('barra');

    this.mapa_SVG_grupos.set(grupo_barra.id(), grupo_barra);

  }

  adicionarLinha(de: Barra, para: Barra, enumLinhaTipo?: EnumLinhaTipo) {
    const linha: Linha = new Linha(de, para);
    this.linhas.push(linha);

    this.redesenhaLinha(linha, enumLinhaTipo);

  }


  redesenhaLinha(linha: Linha, enumLinhaTipo: EnumLinhaTipo = EnumLinhaTipo.poliretas, cor = 'black') {

    const select = this.container.select(`#${linha.id_linha}`);
    select.each(function () { this.remove(); });

    const grupo_linha = this.container.group().id(linha.id_linha) as SVG.G;
    let polilinha: SVG.PolyLine;
    let impedancia: SVG.Element;

    const de_grupo = this.mapa_SVG_grupos.get(linha.de.id_barra);

    const de_grupo_box = de_grupo.select('.criar_linha').first().bbox();
    const para_grupo = this.mapa_SVG_grupos.get(linha.para.id_barra);
    const para_grupo_box = para_grupo.select('.criar_linha').first().bbox();

    console.log(de_grupo_box, para_grupo_box);

    // let eixo_y: string, eixo_x: string;
    para_grupo_box.cx += para_grupo.x();
    para_grupo_box.cy += para_grupo.y();

    de_grupo_box.cx += de_grupo.x();
    de_grupo_box.cy += de_grupo.y();

    grupo_linha.move(de_grupo_box.cx, de_grupo_box.cy);

    const delta_x = para_grupo_box.cx - de_grupo_box.cx;
    const delta_y = para_grupo_box.cy - de_grupo_box.cy;
    const angulo = this.calcularAngulo(delta_x, delta_y);


    if (enumLinhaTipo === EnumLinhaTipo.reta) {
      polilinha = grupo_linha.polyline([[0, 0], [delta_x, delta_y]]);

    } else if (enumLinhaTipo === EnumLinhaTipo.poliretas) {
      polilinha = grupo_linha.polyline(this.criarPontos(delta_x, delta_y, 15));
    }

    polilinha.addClass('linha');

    impedancia = grupo_linha.rect(60, 20)
      .fill({ color: 'white' })
      .stroke({ color: 'black', width: 2 });

    impedancia.move(delta_x / 2 - impedancia.width() / 2, delta_y / 2 - impedancia.height() / 2);
    impedancia.rotate(angulo, impedancia.cx(), impedancia.cy());



  }

  criarPontos(x, y, d): Array<any> {
    const pontos = [];
    pontos.push([0, 0]);
    pontos.push([d, 0]);
    pontos.push([d, y]);
    pontos.push([-d + x, y]);
    console.log(pontos);

    for (let index = pontos.length - 1; index > 0; index--) {
      const ponto = pontos[index];
      pontos.push(ponto);
    }
    console.log(pontos);
    return pontos;
  }

  redesenhaLinhas(linhas: Array<Linha>, enumLinhaTipo = EnumLinhaTipo.reta, cor = 'black') {
    linhas.forEach(
      linha => {
        this.redesenhaLinha(linha, enumLinhaTipo, cor);
      }
    );

  }

  incrementaBarra(tipo: EnumBar) {
    this.qtd_barras_tipo[tipo]++;
    this.qtd_barras_total++;
  }

  /*
  FUNÇÕES DO SVG
  */

  // CRIAÇÃO DE GRUPOS

  // grupo Geral, contém os outros grupos (desenho, texto e seleção)
  criaGrupoBarra(barra: Barra, posicao_x?: number, posicao_y?: number) {
    const self = this;
    const grupo = this.container.group()
      .id(barra.id_barra)
      .addClass('grupo_barra')
      .move(posicao_x || 0, posicao_y || 0) // move para a posição desejada
      .data('barra', barra) // adiciona o dado da barra
      .click(function (event) {
        if (event.ctrlKey || event.shiftKey) {
          self.toogleSelecionado(this);
        } else if (self.ferramenta_atual.linha) {
          if (!self.de_barra) {
            self.de_barra = this.data('barra');
          } else {
            self.para_barra = this.data('barra');
            self.adicionarLinha(self.de_barra, self.para_barra);
            self.de_barra = null;
            self.para_barra = null;
          }
        } else {
          self.limparSelecao();
        }
      });
    return grupo;
  }

  // grupo de Seleção
  criarGrupoBarraSelecao(grupo: SVG.G): SVG.G {
    const grupo_barra_selecao = this.container
      .group()
      .addClass('grupo_barra_selecao')
      ;
    const box = grupo.bbox();
    grupo_barra_selecao.rect(box.w, box.h)
      // .fill({ opacity: 0 })
      .move(box.x, box.y)
      .addClass('retangulo_selecao');

    grupo_barra_selecao.circle(10)
      .addClass('rotacao')
      .move(box.cx, box.cy);
    return grupo_barra_selecao;
  }

  // grupo de desenho (circulos, setas, triangulos)
  criaGrupoBarraDesenho(tipo: EnumBar): SVG.G {
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
    const box = group.bbox();
    group.circle(10).addClass('criar_linha').move(box.x2, box.cy - 5);
    group.addClass('grupo_barra_desenho');
    return group;
  }

  // grupo de texto (P,Q, V, T)
  criaGrupoBarraTexto(grupo: SVG.G): SVG.G {
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




  calcularAngulo(dx, dy) {
    let m = 0;
    if (dx === 0) {
      dx = 1 / 10000000;
    }
    m = dy / dx;
    let angulo = Math.atan2(dx, dy) * 180 / Math.PI;
    angulo += 90;

    if (angulo < 0) {
      angulo = 360 + angulo;
    }
    return -angulo;
  }

  // MANIPULAÇÃO DOS SELECIONADOS

  // adiciona grupo para seleção
  adicionarSelecionado(grupo: SVG.G) {
    if (!grupo.hasClass('grupo_barra')) {
      return;
    }
    const grupo_barra_selecao = grupo.get(2) as SVG.G;
    if (grupo_barra_selecao) {
      grupo_barra_selecao.addClass('selecionado');
    }
    this.selecionados.add(grupo);
  }

  // remove grupo da seleção
  removerSelecionado(grupo: SVG.G) {
    const grupo_barra_selecao = grupo.get(2) as SVG.G;
    if (grupo_barra_selecao) {
      grupo_barra_selecao.removeClass('selecionado');
    }
    this.selecionados.remove(grupo);
  }

  // atualiza o selecionado
  atualizarSelecionado() {
    if (this.selecionados.length() === 1) {
      this.selecionado = this.selecionados.get(0).data('barra');
    } else {
      this.selecionado = null;
    }
  }

  // muda o item selecionado, (se está selecionado passa a não ser, e vice versa)
  toogleSelecionado(grupo: SVG.G) {
    if (this.selecionados.has(grupo)) {
      this.removerSelecionado(grupo);
    } else {
      this.adicionarSelecionado(grupo);
    }
    this.atualizarSelecionado();
  }

  // limpa a seleção
  limparSelecao() {
    const self = this;
    this.container.each(function (c) {
      const elemento: SVG.Element = this;
      if (elemento.hasClass('grupo_barra')) {
        self.removerSelecionado(this);
      }
    });
    this.selecionados = this.container.set();
  }

  habilitarRotacao() {
    const self = this;
    let dx, dy;

    interact('.rotacao').draggable({
      onstart: dragstart,
      onmove: dragmove,
      onend: dragend,
      restrict: {
        restriction: document.getElementById(this.container.id()),
        // elementRect: { top: 0, left: 0, bottom: 0, right: 1 }
      }
    });
    function dragstart(event) {
      console.log(event);
      // x = event.
    }
    function dragmove(event) {
      // // console.log(event);
      dx = event.clientX0 - event.clientX;
      dy = event.clientY0 - event.clientY;
      const angulo = self.calcularAngulo(dx, dy);
      const id_barra = event.target.parentNode.parentNode.id;
      const grupo_barra = self.mapa_SVG_grupos.get(id_barra);
      const grupo_barra_desenho = grupo_barra.select('.grupo_barra_desenho').first() as SVG.G;
      grupo_barra_desenho.rotate(angulo);

    }
    function dragend(event) {

    }
  }

  // Habilita a seleção, mascara de seleção
  habilitarSelecao() {
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
        // elementRect: { top: 0, left: 0, bottom: 0, right: 1 }
      }
    }).styleCursor(false).on('tap', function () { self.limparSelecao(); });

    function dragstart(event) {
      x = event.interaction.pointers[0].offsetX;
      y = event.interaction.pointers[0].offsetY;
      box = self.container.rect(0, 0)
        .move(x, y)
        .id('rect_selection')
        .stroke({ width: 1, dasharray: '5, 5' })
        .stroke('blue')
        .fill({ opacity: 0 });
    }
    function dragmove(event) {
      const pointers = event.interaction.pointers[0];
      const restrict = event.restrict;
      const offsetY = event.interaction.pointers[0].offsetY;
      dx = event.clientX - event.clientX0;
      dy = event.clientY - event.clientY0;

      if (restrict) {
        if (restrict.dx < 0) {
          dx -= 8;
        } else {
          dx += 10;
        }
        if (restrict.dy < 0) {
          dy -= 8;
        } else {
          dy += 10;
        }
      }

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
    }

    function dragend(event) {
      let bounds = box.bbox();
      bounds = fixBounds(bounds);
      box.remove();
      self.limparSelecao();
      self.container.each(function (c) {
        const component: SVG.G = this;
        if (component.hasClass('grupo_barra')) {
          const mybounds: SVG.BBox = component.bbox();

          mybounds.x += component.x();
          mybounds.x2 += component.x();
          mybounds.y += component.y();
          mybounds.y2 += component.y();

          if (mybounds.x > bounds.x && mybounds.x2 < bounds.x2) {
            if (mybounds.y > bounds.y && mybounds.y2 < bounds.y2) {
              self.adicionarSelecionado(this);
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
        bounds.y -= bounds.height;
      }
      return bounds;
    }


  }

  habilitarAdicionarLinha() {
    const self = this;
    let dx, dy, angulo;
    const grupo_linha = this.container.group().id('linha_nova') as SVG.G;
    let de_barra: SVG.G, para_barra: SVG.G;

    let polilinha: SVG.PolyLine;
    let impedancia: SVG.Element;


    interact('.criar_linha').dropzone({
      ondragenter: function (event) {
        event.target.classList.remove('criar_linha');
        event.target.classList.add('nova_linha');
      },
      ondragleave: function (event) {
        event.target.classList.remove('nova_linha');
        event.target.classList.add('criar_linha');

      },
      ondrop: function (event) {
        event.target.classList.remove('nova_linha');
        event.target.classList.add('criar_linha');
        const id_barra = event.target.parentNode.parentNode.id;
        para_barra = self.mapa_SVG_grupos.get(id_barra);
        console.log(para_barra);
        self.adicionarLinha(de_barra.data('barra'), para_barra.data('barra'), EnumLinhaTipo.reta);

      }
    });

    interact('.criar_linha').draggable({
      onstart: dragstart,
      onmove: dragmove,
      onend: dragend,
      restrict: {
        // restriction: '.nova_linha',
        // elementRect: { top: 0, left: 0, bottom: 0, right: 1 }
      }
    });

    function dragstart(event) {
      const id_barra = event.target.parentNode.parentNode.id;
      de_barra = self.mapa_SVG_grupos.get(id_barra);

      const criar_linha_box = de_barra.select('.criar_linha').bbox();

      grupo_linha.move(criar_linha_box.cx, criar_linha_box.cy);

      console.log(grupo_linha);

    }
    function dragmove(event) {
      // de_barra = grupo_barra.clone() as SVG.G;

      grupo_linha.clear();
      dx = event.clientX - event.clientX0;
      dy = event.clientY - event.clientY0;
      angulo = self.calcularAngulo(dx, dy);

      polilinha = grupo_linha.polyline([[0, 0], [dx, dy]]);

      polilinha.addClass('linha');

      impedancia = grupo_linha.rect(60, 20)
        .fill({ color: 'white' })
        .stroke({ color: 'black', width: 2 });

      impedancia.move(dx / 2 - impedancia.width() / 2, dy / 2 - impedancia.height() / 2);
      impedancia.rotate(angulo, impedancia.cx(), impedancia.cy());

    }
    function dragend(event) {
      grupo_linha.clear();
    }
  }

  /*
  CONFIGURAÇÕES DE ATALHOS
  */
  configurarAtalhos() {
    const self = this;
    $(document).keydown(function (e) {
      if (e.ctrlKey) {
        if (e.keyCode === 65) {
          self.container.each(function (c) {
            if (c > 1) {
              self.toogleSelecionado(this);
            }
          });
        }
      }
    });

  }

  // INICIAR FUNÇÕES DE ARRASTAR, MOVIMENTAR E SOLTAR (Drag and Drop)
  inicializarInteract() {
    const self = this;
    let grupo_barra: SVG.G, linhas: Array<Linha> = new Array();
    // interact('.component-simple')
    interact('.barra')
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
        grupo_barra = self.mapa_SVG_grupos
          .get(event.target.id);
        linhas = new Array();

        // como saber se esse grupo que estou movimentando tem uma linha
        self.linhas.forEach(
          linha_usada => {
            if (grupo_barra.id() === linha_usada.de.id_barra || grupo_barra.id() === linha_usada.para.id_barra) {
              linhas.push(linha_usada);
            }
          }
        );
      })
      .on('dragmove', function (event) {
        if (self.selecionados.length() > 0) {
          self.selecionados.each(function (index) {
            const element = self.selecionados.get(index);
            element.dx(event.dx).dy(event.dy);
          });
        } else {
          grupo_barra.dx(event.dx)
            .dy(event.dy);

          self.redesenhaLinhas(linhas);
        }
      })
      .on('dragend', function (event) {
        console.log(linhas);
        self.redesenhaLinhas(linhas);
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
          self.toogleSelecionado(this);
        } else {
          self.limparSelecao();
        }
      })
      .animate(200)
      .move(this.container.width() / 2, this.container.height() / 2);

    return group;
  }
}
