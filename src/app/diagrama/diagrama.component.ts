import { EnumLinhaTipo } from './../models/componente';
import { Component, OnInit } from '@angular/core';

// Bibliotecas externas
import * as $ from 'jquery';
import * as interact from 'interactjs';
import * as SVG from 'svg.js';

// Classes Internas
import { IComponente, Carga, Fonte, Gerador, EnumBarra } from '../models/componente';
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
  private qtdBarrasTipo = {};
  private qtdBarrasTotal = 0;
  enumerador_barra = EnumBarra; // para usar no HTML

  // Controle do SVG
  divNome = 'draw_inside';
  SVGDocumentoPrincipal: SVG.Doc;
  SVGDocumentoLateral: SVG.Doc;

  dicionarioSVGGrupos: Map<string, SVG.G> = new Map();
  barrasSelecionadas: SVG.Set;
  barraSelecionada: SVG.G;

  // Propriedades do Diagrama
  propriedades_diagrama = { visualizar_grade: true, agarrar_grade: false }; // Propriedades do diagrama

  constructor() {
    this.qtdBarrasTipo[EnumBarra.PV] = 0;
    this.qtdBarrasTipo[EnumBarra.PQ] = 0;
    this.qtdBarrasTipo[EnumBarra.Slack] = 0;
  }

  ngOnInit(): void {
    // criação dos elementos na tela
    this.CriarDocumentoSVG();
    this.CriarBarrasFixas();

    // interações com interact.js
    this.HabilitarInteractSelecao();
    this.HabilitarInteractRotacao();
    this.HabilitaInteractMovimento();
    this.HabilitarInteractAdicionarLinha();

    // configuração dos atalhos do teclado
    this.ConfigurarAtalhos();

    // desenha um exemplo na tela
    this.DesenharExemplo(3);
  }

  DesenharExemplo(indice: number) {
    switch (indice) {
      case 3:
        const slack = this.CriarBarra(EnumBarra.Slack);
        const pq1 = this.CriarBarra(EnumBarra.PQ);
        const pq2 = this.CriarBarra(EnumBarra.PQ);
        const pv = this.CriarBarra(EnumBarra.PV);


        this.AdicionarBarra(slack, 300, 100, 90);
        this.AdicionarBarra(pq1, 300, 600, -90);
        this.AdicionarBarra(pq2, 900, 100, 90);
        this.AdicionarBarra(pv, 900, 600, -90);

        this.AdicionarLinha(slack, pq1);
        this.AdicionarLinha(slack, pq2);
        this.AdicionarLinha(pq1, pv);
        this.AdicionarLinha(pq2, pv);
        break;
    }

  }

  CriarDocumentoSVG() {
    const divDesenho = document.getElementById('draw_inside');
    // Obtém as medidas da tela
    const height = divDesenho.clientHeight;
    const width = divDesenho.clientWidth;

    // cria o style para o svg
    const styleSvg = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    // Now (ab)use the @import directive to load make the browser load our css
    styleSvg.textContent = '@import url("./assets/css/svg.css");';

    this.SVGDocumentoPrincipal = SVG(this.divNome)
      .addClass('svg_area')
      .size(width, height);
    this.SVGDocumentoPrincipal.node.appendChild(styleSvg);
    this.barrasSelecionadas = this.SVGDocumentoPrincipal.set();
  }

  CriarBarrasFixas() {
    SVGIcone.criarBarra('bus_vt', 'Slack');
    SVGIcone.criarBarra('bus_pv', 'PV');
    SVGIcone.criarBarra('bus_pq', 'PQ');
    SVGIcone.criarBarra('curto_circuito', 'short');
  }

  /*
  FUNÇÕES DO SISTEMA ELÉTRICO DE POTÊNCIA
  */

  CriarBarra(tipo: EnumBarra): Barra {
    // Sistema Elétrico de Potência
    const barra: Barra = new Barra(tipo); // cria uma nova barra com o tipo associado
    barra.id_barra = `barra_${this.qtdBarrasTotal}`; // atualiza o identificador
    // barra.nome = `Barra ${this.qtd_barras_total}`; // Atualiza o nome
    barra.nome = `${tipo.toString()} ${this.qtdBarrasTipo[tipo]}`;
    if (tipo === EnumBarra.Slack) {
      barra.nome = `${tipo.toString()}`;
    }
    this.IncrementaBarra(barra.tipo); // incremmenta o numero de barras
    this.barras.push(barra); // adiciona na lista
    return barra;
  }

  AdicionarBarra(barra: Barra, posicao_x?: number, posicao_y?: number, angulo: number = 0) {
    const self = this;

    // SVG
    const grupoBarra = this.CriaGrupoBarra(barra, posicao_x, posicao_y);

    // Grupo do desenhos (circulos, linha, etc)
    const grupoBarraDesenho = this.CriaGrupoBarraDesenho(barra.tipo).rotate(angulo);
    grupoBarra.add(grupoBarraDesenho);

    // Grupo de tenho (P,Q,V,T)
    this.CriaGrupoBarraTexto(grupoBarra);

    // Grupo de seleção
    const grupoBarraSelecao = this.CriarGrupoBarraSelecao(grupoBarra);
    grupoBarra.add(grupoBarraSelecao);

    // Adiciona no dicionário do SVG
    this.dicionarioSVGGrupos.set(grupoBarra.id(), grupoBarra);
  }

  AdicionarLinha(de: Barra, para: Barra, enumLinhaTipo?: EnumLinhaTipo) {
    const linha: Linha = new Linha(de, para);
    this.linhas.push(linha);
    this.RedesenhaLinha(linha, enumLinhaTipo);
  }

  CriarPoliLinha(x, y, d): Array<Array<number>> {
    // cria uma lista de pontos.mapeando o caminho
    const pontos = [];
    pontos.push([0, 0]);
    pontos.push([d, 0]);
    pontos.push([d, y]);
    pontos.push([-d + x, y]);

    // readiciona de ordem invetida, para evitar poligno
    for (let index = pontos.length - 1; index > 0; index--) {
      pontos.push(pontos[index]);
    }
    return pontos;
  }

  RedesenhaLinha(linha: Linha, enumLinhaTipo: EnumLinhaTipo = EnumLinhaTipo.reta) {
    // remover linha existente com o mesmo identificador
    const selecao = this.SVGDocumentoPrincipal.select(`#${linha.id_linha}`);
    selecao.each(function () { this.remove(); });

    // cria um grupo novo para a linha
    const grupoLinha = this.SVGDocumentoPrincipal.group().id(linha.id_linha) as SVG.G;
    let poliLinha: SVG.PolyLine;
    let impedancia: SVG.Element;

    // identifica as ligações da linha (da barra, para barra)
    const deBarra = this.dicionarioSVGGrupos.get(linha.de.id_barra);
    const deBarraCriaLinhaBox = deBarra.select('.criarLinha').bbox();
    const paraBarra = this.dicionarioSVGGrupos.get(linha.para.id_barra);
    const paraBarraCriarLinhaBox = paraBarra.select('.criarLinha').bbox();

    // move o ponto inicial para o meio do circulo
    grupoLinha.move(deBarraCriaLinhaBox.cx, deBarraCriaLinhaBox.cy);

    // calcula distância e angulo da linha
    const delta_x = paraBarraCriarLinhaBox.cx - deBarraCriaLinhaBox.cx;
    const delta_y = paraBarraCriarLinhaBox.cy - deBarraCriaLinhaBox.cy;
    const angulo = this.CalcularAngulo(delta_x, delta_y);

    // verifica qual é o tipo da linha (reta, polinha ou curva)
    if (enumLinhaTipo === EnumLinhaTipo.reta) {
      poliLinha = grupoLinha.polyline([[0, 0], [delta_x, delta_y]]);
    } else if (enumLinhaTipo === EnumLinhaTipo.poliretas) {
      poliLinha = grupoLinha.polyline(this.CriarPoliLinha(delta_x, delta_y, 15));
    }

    // adiciona impedância
    impedancia = grupoLinha.rect(60, 20);
    impedancia.move(delta_x / 2 - impedancia.width() / 2, delta_y / 2 - impedancia.height() / 2);
    impedancia.rotate(angulo);

    // adiciona as respectivas classes
    poliLinha.addClass('linha');
    impedancia.addClass('impedancia');
  }

  RedesenhaLinhas(linhas: Array<Linha>, enumLinhaTipo = EnumLinhaTipo.reta) {
    linhas.forEach(
      linha => {
        this.RedesenhaLinha(linha, enumLinhaTipo);
      }
    );
  }

  IncrementaBarra(tipo: EnumBarra) {
    this.qtdBarrasTipo[tipo]++; // respectivo tipo
    this.qtdBarrasTotal++; // barras total
  }

  /*
  FUNÇÕES DO SVG
  */

  // CRIAÇÃO DE GRUPOS

  // grupo Geral, contém os outros grupos (desenho, texto e seleção)
  CriaGrupoBarra(barra: Barra, posicao_x?: number, posicao_y?: number) {
    const self = this;
    return this.SVGDocumentoPrincipal.group()
      .id(barra.id_barra)
      .addClass('grupoBarra')
      .move(posicao_x || 0, posicao_y || 0) // move para a posição desejada
      .data('barra', barra) // adiciona o dado da barra
      .click(function (event) {
        if (event.ctrlKey || event.shiftKey) {
          self.AlternarBarraSelecionada(this);
        } else {
          self.LimparSelecaoBarras();
        }
      })
      .addClass('componente');
  }

  // grupo de Seleção
  CriarGrupoBarraSelecao(grupoBarra: SVG.G): SVG.G {
    // cria o grupo de seleção
    const grupoBarraSelecao = this.SVGDocumentoPrincipal
      .group()
      .addClass('grupoBarraSelecao');

    // pega a caixa delimitadora do grupo barra
    const grupoBarraBBox = grupoBarra.bbox();
    grupoBarraSelecao.rect(grupoBarraBBox.w, grupoBarraBBox.h)
      .move(grupoBarraBBox.x, grupoBarraBBox.y)
      .addClass('retanguloSelecao');

    return grupoBarraSelecao;
  }

  // grupo de desenho (circulos, setas, triangulos)
  CriaGrupoBarraDesenho(tipo: EnumBarra): SVG.G {
    const grupo = this.SVGDocumentoPrincipal.group();
    if (tipo === EnumBarra.Slack || tipo === EnumBarra.PV) {
      grupo.circle(50)
        .move(2, 25)
        .addClass('barra')
        .addClass('circulo');
      grupo.line(52, 50, 80, 50)
        .addClass('barra')
        .addClass('linhaHorizontal');
      grupo.line(80, 10, 80, 90)
        .addClass('barra')
        .addClass('linhaVertical');
      grupo.text(tipo === EnumBarra.PV ? '~' : '∞')
        .addClass('barra')
        .addClass('texto')
        .font({ size: 50, family: 'Times New Roman' })
        .move(10, 20); // texto
    } else if (tipo === EnumBarra.PQ) {
      grupo.line(20, 50, 80, 50)
        .addClass('barra')
        .addClass('linhaHorizontal');
      grupo.line(80, 10, 80, 90)
        .addClass('barra')
        .addClass('linhaVertical');
      grupo.path('m25,60l10,-25l10,25l-10,0l-10,0z') // triangulo
        .rotate(-90, 25, 60)
        .addClass('barra')
        .addClass('triangulo');
    }
    const box = grupo.bbox();
    grupo.circle(10)
      .addClass('rotacao')
      .move(box.cx - 5, box.cy - 5);

    grupo.circle(10).addClass('criarLinha')
      .move(box.x2 - 5, box.cy - 5);
    grupo.addClass('barra')
      .addClass('grupoBarraDesenho');
    return grupo;
  }

  // grupo de texto (P,Q, V, T)
  CriaGrupoBarraTexto(grupoBarra: SVG.G): SVG.G {
    const barra: Barra = grupoBarra.data('barra') as Barra;
    const box = grupoBarra.bbox();
    const grupoTexto = grupoBarra.group();
    // TEM Q PENSAR ONDE VAI FICAR A POSIÇÃO DE CADA ITEM DA BARRA
    grupoTexto.text(barra.nome)
      .id('nome')
      .dx(box.x)
      .dy(box.width * 1.1);

    grupoTexto.text(`P=${barra.pCarga} pu`)
      .id('P')
      .dx(-box.height * 0.1)
      .dy(-box.width * 0.5);

    grupoTexto.text(`Q=${barra.qCarga} pu`)
      .id('Q')
      .dx(-box.height * 0.1)
      .dy(-box.width * 0.3);

    grupoTexto.text(`${barra.tensao_0}∠${barra.angulo_0}° pu`)
      .id('PV')
      .dy(-box.width * 0.15)
      .dx(box.height * 0.7);
    return grupoTexto;
  }

  CalcularAngulo(dx, dy, ceil = 1) {
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
    angulo = Math.ceil(angulo / ceil) * ceil;

    return -angulo;
  }

  // MANIPULAÇÃO DOS SELECIONADOS

  // adiciona grupo para seleção
  AdicionarBarraSelecionada(grupoBarra: SVG.G) {
    if (!grupoBarra.hasClass('grupoBarra')) {
      return;
    }
    const grupoBarraSelecao = grupoBarra.get(2) as SVG.G;
    if (grupoBarraSelecao) {
      grupoBarraSelecao.addClass('selecionado');
    }
    this.barrasSelecionadas.add(grupoBarra);
  }

  // remove grupo da seleção
  RemoverBarraSelecionada(grupoBarra: SVG.G) {
    if (!grupoBarra.hasClass('grupoBarra')) {
      return;
    }
    const grupoBarraSelecao = grupoBarra.get(2) as SVG.G;
    if (grupoBarraSelecao) {
      grupoBarraSelecao.removeClass('selecionado');
    }
    this.barrasSelecionadas.remove(grupoBarra);
  }

  // atualiza o selecionado
  AtualizarBarraSelecionada() {
    if (this.barrasSelecionadas.length() === 1) {
      this.barraSelecionada = this.barrasSelecionadas.get(0).data('barra');
    } else {
      this.barraSelecionada = null;
    }
  }

  // muda o item selecionado, (se está selecionado passa a não ser, e vice versa)
  AlternarBarraSelecionada(grupo: SVG.G) {
    if (this.barrasSelecionadas.has(grupo)) {
      this.RemoverBarraSelecionada(grupo);
    } else {
      this.AdicionarBarraSelecionada(grupo);
    }
    this.AtualizarBarraSelecionada();
  }

  // limpa a seleção
  LimparSelecaoBarras() {
    const self = this;
    console.log(`limpando barras ${self.barrasSelecionadas.length()} selecionadas`);
    this.SVGDocumentoPrincipal.each(function (c) {
      self.RemoverBarraSelecionada(this);
    });
    this.barrasSelecionadas = this.SVGDocumentoPrincipal.set();
  }

  HabilitarInteractRotacao() {
    const self = this;
    let dx, dy;
    let ceil = 10;
    let grupoBarra: SVG.G, linhasConectadas: Array<Linha> = new Array();

    interact('.rotacao').draggable({
      onstart: function (event) {
        const id_barra = event.target.parentNode.parentNode.id;
        grupoBarra = self.dicionarioSVGGrupos.get(id_barra);
        const barra = grupoBarra.data('barra') as Barra;
        linhasConectadas = self.linhasConectadasBarra(barra);
      },
      onmove: function (event) {
        dx = event.clientX0 - event.clientX;
        dy = event.clientY0 - event.clientY;
        if (event.shiftKey) {
          ceil = 45;
        } else {
          ceil = 10;
        }
        const angulo = self.CalcularAngulo(dx, dy, ceil);
        const grupoBarraDesenho = grupoBarra.select('.grupoBarraDesenho').first() as SVG.G;
        grupoBarraDesenho.rotate(angulo);
        self.RedesenhaLinhas(linhasConectadas);
      }
    });
  }

  // Habilita a seleção, mascara de seleção
  HabilitarInteractSelecao() {
    const self = this;
    let box_x = 1, box_y = 1;
    let box: SVG.Element, x = 0, y = 0, dx, dy;
    this.SVGDocumentoPrincipal.rect(this.SVGDocumentoPrincipal.width(), this.SVGDocumentoPrincipal.height())
      .fill({ color: 'transparent' })
      .id('mask_selection');
    interact('#mask_selection').draggable({
      onstart: function (event) {
        // cria um retângulo vazio no cursor do mouse
        x = event.interaction.pointers[0].offsetX;
        y = event.interaction.pointers[0].offsetY;
        box = self.SVGDocumentoPrincipal.rect(0, 0)
          .move(x, y)
          .id('rect_selection')
          .stroke({ width: 1, dasharray: '5, 5' })
          .stroke('blue')
          .fill({ opacity: 0 });
      },
      onmove: function (event) {
        const restrict = event['restrict'];
        let transform_x = 0, transform_y = 0;

        // calcula a distância clicada até o mouse atual
        dx = event.clientX - event.clientX0;
        dy = event.clientY - event.clientY0;

        // verifica se passou do quadrado e corrige.
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

        // verifica se a distância de x é contrária ao movimento
        if (dx < 0) {
          transform_x = dx;
          dx *= -1;
          box_x = -1;
        }
        // verifica se a distância de y é contrária ao movimento
        if (dy < 0) {
          transform_y = dy;
          dy *= -1;
          box_y = -1;
        }
        // inverte os eixos, qnd são negativos;
        box.transform({ x: transform_x, y: transform_y });
        box.width(dx)
          .height(dy);

        verificaBarrasNaSelecao(box);

      },
      onend: function () {
        verificaBarrasNaSelecao(box);
        box.remove();
      },
      restrict: {
        restriction: document.getElementById(this.SVGDocumentoPrincipal.id()),
      }
    }).styleCursor(false).on('tap', function () { console.log('tap'); self.LimparSelecaoBarras(); });

    function verificaBarrasNaSelecao(retanguloSelecao: SVG.Element) {
      self.SVGDocumentoPrincipal.each(function (c) {
        const componente: SVG.G = this;

        if (componente.hasClass('grupoBarra')) {
          if ((componente.cx() > retanguloSelecao.x() && componente.cx() < (retanguloSelecao.x() + retanguloSelecao.width()))
            || ((componente.cx() > (box.x() - box.width()))) && (componente.cx() < (box.x()))) {
            if ((componente.cy() > retanguloSelecao.y() && componente.cy() < (retanguloSelecao.y() + retanguloSelecao.height()))
              || ((componente.cy() > (box.y() - box.height()))) && (componente.cy() < (box.y()))) {
              if (!self.barrasSelecionadas.has(componente)) {
                self.AdicionarBarraSelecionada(componente);
              }
            } else {
              if (self.barrasSelecionadas.has(componente)) {
                self.RemoverBarraSelecionada(componente);
              }
            }
          } else {
            if (self.barrasSelecionadas.has(componente)) {
              self.RemoverBarraSelecionada(componente);
            }
          }
        }
      });
    }
  }

  HabilitarInteractAdicionarLinha() {
    const self = this;
    let dx, dy, angulo;
    const grupoLinha = this.SVGDocumentoPrincipal.group().id('linha_nova') as SVG.G;
    let deBarra: SVG.G, paraBarra: SVG.G;

    let polilinha: SVG.PolyLine;
    let impedancia: SVG.Element;

    interact('.criarLinha').dropzone({
      accept: '.criarLinha',
      ondragenter: function (event) {
        event.target.classList.remove('criarLinha');
        event.target.classList.add('nova_linha');
      },
      ondragleave: function (event) {
        event.target.classList.remove('nova_linha');
        event.target.classList.add('criarLinha');

      },
      ondrop: function (event) {
        event.target.classList.remove('nova_linha');
        event.target.classList.add('criarLinha');
        const id_barra = event.target.parentNode.parentNode.id;
        paraBarra = self.dicionarioSVGGrupos.get(id_barra);
        self.AdicionarLinha(deBarra.data('barra'), paraBarra.data('barra'), EnumLinhaTipo.reta);

      }
    });

    interact('.criarLinha').draggable({
      onstart: dragstart,
      onmove: dragmove,
      onend: dragend,
      restrict: {
        restriction: document.getElementById(this.SVGDocumentoPrincipal.id()),
        endOnly: false
      }
    });

    function dragstart(event) {
      const id_barra = event.target.parentNode.parentNode.id;
      deBarra = self.dicionarioSVGGrupos.get(id_barra);
      const circulo = deBarra.select('.criarLinha');
      if (circulo) {
        const criarLinhaBox = deBarra.select('.criarLinha').bbox();
        grupoLinha.move(criarLinhaBox.cx, criarLinhaBox.cy);
      }
    }
    function dragmove(event) {
      grupoLinha.clear();
      dx = event.clientX - event.clientX0;
      dy = event.clientY - event.clientY0;
      angulo = self.CalcularAngulo(dx, dy);

      polilinha = grupoLinha.polyline([[0, 0], [dx, dy]]);
      polilinha.addClass('linha');

      impedancia = grupoLinha.rect(60, 20)
        .fill({ color: 'white' })
        .stroke({ color: 'black', width: 2 });

      impedancia.move(dx / 2 - impedancia.width() / 2, dy / 2 - impedancia.height() / 2);
      impedancia.rotate(angulo, impedancia.cx(), impedancia.cy());
    }
    function dragend(event) {
      grupoLinha.clear();
    }
  }

  linhasConectadasBarra(barra: Barra): Array<Linha> {
    const linhas = new Array();
    this.linhas.forEach(
      linha_usada => {
        if (barra.id_barra === linha_usada.de.id_barra || barra.id_barra === linha_usada.para.id_barra) {
          linhas.push(linha_usada);
        }
      }
    );
    return linhas;
  }

  /*
  CONFIGURAÇÕES DE ATALHOS
  */
  ConfigurarAtalhos() {
    const self = this;
    $(document).keydown(function (e) {
      if (e.ctrlKey) {
        if (e.keyCode === 65) {
          self.SVGDocumentoPrincipal.each(function (c) {
            if (c > 1) {
              self.AlternarBarraSelecionada(this);
            }
          });
        }
      }

    });
    $(document).keyup(function (e) {
      if (e.keyCode === 27) {
        console.log('esc');
        self.LimparSelecaoBarras();
      }
    });

  }

  // INICIAR FUNÇÕES DE ARRASTAR, MOVIMENTAR E SOLTAR (Drag and Drop)
  HabilitaInteractMovimento() {
    let grupoBarra: SVG.G, linhas: Array<Linha> = new Array();
    const self = this;
    const ceil = 10;
    interact('.componente')
      .draggable({
        inertia: true, // enable inertial throwing
        restrict: {
          restriction: document.getElementById(this.SVGDocumentoPrincipal.id()),
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        }
      })
      .on('dragstart', function (event) {
        grupoBarra = self.dicionarioSVGGrupos
          .get(event.target.id);
        const barra = grupoBarra.data('barra') as Barra;
        linhas = self.linhasConectadasBarra(barra);
      })
      .on('dragmove', function (event) {

        if (self.barrasSelecionadas.length() > 0) {
          self.barrasSelecionadas.each(function (index) {
            const element = self.barrasSelecionadas.get(index);
            element.dx(event.dx).dy(event.dy);
          });
        } else {
          grupoBarra.dx(event.dx)
            .dy(event.dy);

          self.RedesenhaLinhas(linhas);
        }
      })
      .on('dragend', function (event) {
        self.RedesenhaLinhas(linhas);
      });

    interact('.component-fixed').draggable({
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
    const node = this.SVGDocumentoPrincipal;
    const group = node.group().size(100, 100);
    const self = this;
    if (name === 'PV' || name === 'PV') {
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
          self.AlternarBarraSelecionada(this);
        } else {
          self.LimparSelecaoBarras();
        }
      })
      .animate(200)
      .move(this.SVGDocumentoPrincipal.width() / 2, this.SVGDocumentoPrincipal.height() / 2);

    return group;
  }
}
