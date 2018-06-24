import { EnumLinhaTipo, EnumCurtoTipo } from './../models/componente';
import { Component, OnInit } from '@angular/core';

// Bibliotecas externas
import * as $ from 'jquery';
import * as interact from 'interactjs';
import * as SVG from 'svg.js';

// Classes Internas
import { IComponente, Carga, Fonte, Gerador, EnumTipoBarra } from '../models/componente';
import { SVGIcone } from './svg-icones';
import { Barra } from './models/barra';
import { Linha } from './models/linha';
import { Curto } from './models/curto';

@Component({
  selector: 'app-diagrama',
  templateUrl: './diagrama.component.html',
  styleUrls: ['./diagrama.component.css']
})

export class DiagramaComponent implements OnInit {


  // Elementos do Sistema Elétrico de Potência
  private barras: Array<Barra> = new Array();
  private linhas: Array<Linha> = new Array();
  private curto: Curto = new Curto();
  private slack: Barra = null;

  private mapaBarras: Map<string, Barra> = new Map();
  private mapaLinhas: Map<string, Linha> = new Map();

  // Controle de identificação
  private qtdBarrasTipo = {};
  private qtdBarrasTotal = 0;
  enumerador_barra = EnumTipoBarra; // para usar no HTML

  // Controle do SVG
  SVGPrincipal: SVG.Doc;
  SVGLateral: SVG.Doc;

  mapaGruposSVG: Map<string, SVG.G> = new Map();
  barrasSelecionadas: SVG.Set;
  barrasCopiadas: SVG.Set;
  barrasRecortadas: SVG.Set;
  barraSelecionada: SVG.G;

  // Propriedades do Diagrama
  propriedades_diagrama = { visualizar_grade: true, agarrar_grade: false }; // Propriedades do diagrama

  constructor() {
    this.qtdBarrasTipo[EnumTipoBarra.PV] = 0;
    this.qtdBarrasTipo[EnumTipoBarra.PQ] = 0;
    this.qtdBarrasTipo[EnumTipoBarra.Slack] = 0;
  }

  ngOnInit(): void {
    // criação dos elementos na tela
    // divNome = 'draw_inside';
    this.CriarDocumentoSVG('svg_principal');
    this.CriarDocumentoSVG('svg_lateral');
    this.CriarComponentesFixos();

    // interações com interact.js
    this.HabilitarInteractSelecao();
    this.HabilitarInteractRotacao();
    this.HabilitaInteractMovimento();
    this.HabilitarInteractCriarLinha();
    this.HabilitarInteractCriarCurto();

    // configuração dos atalhos do teclado
    this.ConfigurarAtalhosTeclado();

    // desenha um exemplo na tela
    this.DesenharExemplo(3);

    this.ExcluirBarra(this.barras[0]);
    this.ExcluirBarra(this.barras[1]);

  }

  DesenharExemplo(indice: number) {
    switch (indice) {
      case 3:
        const slack = this.CriarBarra(EnumTipoBarra.Slack);
        const pq1 = this.CriarBarra(EnumTipoBarra.PQ);
        const pq2 = this.CriarBarra(EnumTipoBarra.PQ);
        const pv = this.CriarBarra(EnumTipoBarra.PV);


        this.AdicionarBarra(slack, 300, 100, 90);
        this.AdicionarBarra(pq1, 300, 600, -90);
        this.AdicionarBarra(pq2, 900, 100, 90);
        this.AdicionarBarra(pv, 900, 600, -90);

        this.AdicionarLinha(slack, pq1);
        this.AdicionarLinha(slack, pq2);
        this.AdicionarLinha(slack, pv);
        this.AdicionarLinha(pq1, pv);
        this.AdicionarLinha(pq2, pv);
        break;
    }

  }

  CriarDocumentoSVG(SVGNome: string) {
    const divDesenho = document.getElementById(SVGNome);
    // Obtém as medidas da tela
    const height = divDesenho.clientHeight;
    const width = divDesenho.clientWidth;

    // cria o style para o svg
    const styleSvg = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    // Now (ab)use the @import directive to load make the browser load our css
    styleSvg.textContent = '@import url("./assets/css/svg.css");';


    if (SVGNome === 'svg_principal') {
      this.SVGPrincipal = SVG(SVGNome)
        .id('svg_principal')
        .addClass('svg_area')
        .size(width, height);
      this.SVGPrincipal.node.appendChild(styleSvg);
      this.barrasSelecionadas = this.SVGPrincipal.set();
      this.barrasCopiadas = this.SVGPrincipal.set();
      this.barrasRecortadas = this.SVGPrincipal.set();

    } else if (SVGNome === 'svg_lateral') {

      this.SVGLateral = SVG(SVGNome)
        .id('svg_lateral')
        .addClass('svg_area')
        .size(width, height);
    }

  }

  CriarComponentesFixos() {
    // barras
    this.CriarBarraFixa(EnumTipoBarra.Slack);
    this.CriarBarraFixa(EnumTipoBarra.PV);
    this.CriarBarraFixa(EnumTipoBarra.PQ, 180);

    // curto;
    this.CriarCurtoCircuito(this.SVGLateral);

  }

  CriarCurtoCircuito(SVGUsado: SVG.Doc = this.SVGPrincipal): SVG.G {
    const grupoCurto = SVGUsado.group();
    const grupoCurtoPrincipal = this.mapaGruposSVG.get('curtoPrincipal');
    if (grupoCurtoPrincipal) {
      return grupoCurtoPrincipal;
    }

    const largura = 50;
    grupoCurto.addClass('curtoCircuito');
    grupoCurto.line(0, 0, largura, largura);
    grupoCurto.line(0, largura, largura, 0);
    grupoCurto.circle(10).cx(largura / 2).cy(largura / 2);
    if (SVGUsado.id() === 'svg_lateral') {
      grupoCurto.id('curtoFixo')
        .y(400)
        .cx(SVGUsado.width() / 2);
    } else {
      grupoCurto.id('curtoPrincipal');
    }

    return grupoCurto;
  }

  CriarBarraFixa(enumBarra: EnumTipoBarra, angulo = 0) {
    const barra = new Barra(enumBarra);
    const x = this.SVGLateral.width() / 4;

    let y = 50;
    switch (enumBarra) {
      case EnumTipoBarra.Slack:
        y += 0;
        break;
      case EnumTipoBarra.PV:
        y += 100;
        break;
      case EnumTipoBarra.PQ:
        y += 200;
        break;
    }
    const grupoBarra = this.CriaGrupoBarra(barra, x, y, this.SVGLateral);

    // Grupo do desenhos (circulos, linha, etc)
    const grupoBarraDesenho = this.CriaGrupoBarraDesenho(barra.tipo, this.SVGLateral).rotate(angulo);
    grupoBarra.add(grupoBarraDesenho);
    grupoBarra.data('angulo', angulo);
  }

  /*
  FUNÇÕES DO SISTEMA ELÉTRICO DE POTÊNCIA
  */

  /*
    CURTOS
  */

  AdicionarCurto() {

    const self = this;
    const curto: Curto = this.curto;
    if (curto.linha) {
      const grupoLinha = this.mapaGruposSVG.get(`${curto.linha.id_linha}`);
      grupoLinha.select('.polilinha').each(function () {
        const grupoCurto = self.CriarCurtoCircuito();
        const grupoPolilinha = this.add(grupoCurto) as SVG.G;
        const rect = grupoPolilinha.get(1);
        grupoCurto.cx(rect.cx() - 20).cy(rect.cy());
      });

    } else if (curto.barra) {
      const grupoBarra = this.mapaGruposSVG.get(`${curto.barra.id_barra}`);
      // console.log(`adicionando curto na ${curto.barra.nome}`);
    }
  }


  /*
    BARRAS
  */
  // adicionando barra na tela
  AdicionarBarra(barra: Barra, posicao_x?: number, posicao_y?: number, angulo: number = 0) {
    // SVG
    const grupoBarra = this.CriaGrupoBarra(barra, posicao_x, posicao_y);
    grupoBarra.data('angulo', angulo);

    // Grupo do desenhos (circulos, linha, etc)
    const grupoBarraDesenho = this.CriaGrupoBarraDesenho(barra.tipo).rotate(angulo);
    grupoBarra.add(grupoBarraDesenho);

    // Grupo de tenho (P,Q,V,T)
    this.AtualizaGrupoBarraTexto(grupoBarra);

    // Grupo de seleção
    const grupoBarraSelecao = this.CriarGrupoBarraSelecao(grupoBarra);
    grupoBarra.add(grupoBarraSelecao);

    // Adiciona no dicionário do SVG
    this.mapaGruposSVG.set(grupoBarra.id(), grupoBarra);
  }

  // excluindo barra na tela e no mapa de barras
  ExcluirBarra(barra: Barra) {
    if (this.mapaGruposSVG.get(barra.id_barra)) {
      this.ExcluirLinhas(barra);
      this.RemoverBarra(barra);
    }
  }

  // criando barras
  CriarBarra(tipo: EnumTipoBarra): Barra {
    // Sistema Elétrico de Potência
    const barra: Barra = new Barra(tipo); // cria uma nova barra com o tipo associado
    barra.id_barra = `barra_${this.qtdBarrasTotal}`; // atualiza o identificador
    barra.nome = `${tipo.toString()} ${this.qtdBarrasTipo[tipo]}`;
    if (tipo === EnumTipoBarra.Slack) {
      barra.nome = `${tipo.toString()}`;
      if (!this.slack) {
        this.slack = barra;
        // this.SVGLateral.select('#Slack').each(function () {
        //   this.removeClass('componente-lateral');
        // });
      } else {
        return null;
      }
    }
    this.IncrementaBarra(barra.tipo); // incremmenta o numero de barras
    this.barras.push(barra); // adiciona na lista
    this.mapaBarras.set(barra.id_barra, barra); // adiciona no mapa de barras
    return barra;
  }

  // copiando uma barra
  CopiarBarra(barra: Barra): Barra {
    const novaBarra = this.CriarBarra(barra.tipo);
    if (novaBarra) {
      novaBarra.tensao_0 = barra.tensao_0;
      novaBarra.angulo_0 = barra.angulo_0;
      novaBarra.pCarga = barra.pCarga;
      novaBarra.qCarga = barra.qCarga;
      novaBarra.pGerada = barra.pGerada;
      novaBarra.qGerada = barra.qGerada;
      novaBarra.pGeradaMax = barra.pGeradaMax;
      novaBarra.pGeradaMin = barra.pGeradaMin;
      novaBarra.qGeradaMax = barra.qGeradaMax;
      novaBarra.qGeradaMin = barra.qGeradaMin;
      novaBarra.X = barra.X;
    }
    return novaBarra;
  }

  // removendo uma barra
  RemoverBarra(barra: Barra) {
    if (barra.tipo === EnumTipoBarra.Slack) {
      this.slack = null;
    }
    this.mapaGruposSVG.get(barra.id_barra).remove();
    this.mapaGruposSVG.delete(barra.id_barra);
    this.barras.splice(this.barras.indexOf(barra), 1);
    this.mapaBarras.delete(barra.id_barra);
    // this.DecrementarBarra(barra.tipo);
  }

  // incremento de barras novas
  IncrementaBarra(tipo: EnumTipoBarra) {
    this.qtdBarrasTipo[tipo]++; // respectivo tipo
    this.qtdBarrasTotal++; // barras total
  }

  // decremetando barras
  DecrementarBarra(tipo: EnumTipoBarra) {
    this.qtdBarrasTipo[tipo]--; // respectivo tipo
    this.qtdBarrasTotal--; // barras total
  }

  /*
     Linhas
  */

  // adicionando linhas na tela
  AdicionarLinha(de: Barra, para: Barra, enumLinhaTipo?: EnumLinhaTipo) {
    const linha: Linha = new Linha(de, para);
    this.linhas.push(linha);
    this.mapaLinhas.set(linha.id_linha, linha);
    this.DesenhaLinha(linha, enumLinhaTipo);
  }

  // excluindo linhas na tela
  ExcluirLinhas(barra: Barra) {
    const paraRemover = [];
    this.linhas.forEach((linha) => {
      if (linha.de.id_barra === barra.id_barra || linha.para.id_barra === barra.id_barra) {
        this.mapaGruposSVG.get(linha.id_linha).remove();
        this.mapaGruposSVG.delete(linha.id_linha);
        paraRemover.push(linha);
      }
    });
    console.log(`excluindo ${paraRemover.length} linhas associadas a barra ${barra.id_barra}`);

    paraRemover.forEach(linha => {
      this.linhas.splice(this.linhas.indexOf(linha), 1);
      this.mapaLinhas.delete(linha.id);
    });
  }

  // criando polilinhas
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

  // redesenhando linha na tela
  DesenhaLinha(linha: Linha, enumLinhaTipo: EnumLinhaTipo = EnumLinhaTipo.reta) {
    // remover linha existente com o mesmo identificador
    const selecao = this.SVGPrincipal.select(`#${linha.id_linha}`);
    selecao.each(function () { this.remove(); });

    // cria um grupo novo para a linha
    const grupoLinha = this.SVGPrincipal.group().id(linha.id_linha);

    // verificar se existe curto nessa linha



    const poliLinha: SVG.G = grupoLinha.group().addClass('polilinha');
    const impedancia: SVG.G = grupoLinha.group();
    let grupoCurto: SVG.G;

    // identifica as ligações da linha (da barra, para barra)
    const deBarra = this.mapaGruposSVG.get(linha.de.id_barra);
    const deBarraCriaLinhaBox = deBarra.select('.criarLinha').bbox();
    const paraBarra = this.mapaGruposSVG.get(linha.para.id_barra);
    const paraBarraCriarLinhaBox = paraBarra.select('.criarLinha').bbox();

    // move o ponto inicial para o meio do circulo
    grupoLinha.move(deBarraCriaLinhaBox.cx, deBarraCriaLinhaBox.cy);

    // calcula distância e angulo da linha
    const delta_x = paraBarraCriarLinhaBox.cx - deBarraCriaLinhaBox.cx;
    const delta_y = paraBarraCriarLinhaBox.cy - deBarraCriaLinhaBox.cy;
    const angulo = this.CalcularAngulo(delta_x, delta_y);
    let hipotenusa = Math.hypot(delta_x, delta_y);

    // verifica qual é o tipo da linha (reta, polinha ou curva)
    if (enumLinhaTipo === EnumLinhaTipo.reta) {
      const afastamento = 50;
      if (hipotenusa > afastamento) {
        hipotenusa -= afastamento;
      }
      const altura = 25;
      poliLinha.rect(hipotenusa, altura)
        .dx(afastamento / 2)
        .dy(-altura / 2)
        .rotate(angulo, -afastamento, -altura / 2)
        .translate(delta_x, delta_y)
        .addClass('linha')
        .addClass('transmissao');
      poliLinha.polyline([[0, 0], [delta_x, delta_y]])
        .addClass('linha');
      grupoLinha.data('angulo', angulo);

    } else if (enumLinhaTipo === EnumLinhaTipo.poliretas) {
      poliLinha.polyline(this.CriarPoliLinha(delta_x, delta_y, 15));
    }

    if (this.curto.linha) {
      if (this.curto.linha.id_linha === linha.id_linha) {
        grupoCurto = poliLinha.group().addClass('curtoCircuito');
        const largura = 40;
        grupoCurto.addClass('curtoCircuito');
        grupoCurto.line(0, 0, largura, largura);
        grupoCurto.line(0, largura, largura, 0);
        grupoCurto.circle(largura / 5)
          .cx(largura / 2)
          .cy(largura / 2);
        grupoCurto.cx(-this.curto.afastamento * hipotenusa * Math.cos(angulo * Math.PI / 180));
        grupoCurto.cy(-this.curto.afastamento * hipotenusa * Math.sin(angulo * Math.PI / 180));
        grupoCurto.rotate(angulo);
      }
    }

    // adiciona impedância
    const rect = impedancia.rect(60, 20).rotate(angulo);
    impedancia.move(delta_x / 2 - rect.width() / 2, delta_y / 2 - rect.height() / 2)
      .front();

    const texto = impedancia.group()
      .text(linha.nome)
      .dy(rect.height() / 2 + 5);

    // adiciona as respectivas classes
    poliLinha.addClass('linha');
    rect.addClass('impedancia');
    texto.addClass('linha')
      .addClass('texto');

    this.mapaGruposSVG.set(linha.id_linha, grupoLinha);
  }

  // redesenha várias linhas na tela
  DesenhaLinhas(linhas: Array<Linha>, enumLinhaTipo = EnumLinhaTipo.reta) {
    linhas.forEach(
      linha => {
        this.DesenhaLinha(linha, enumLinhaTipo);
      }
    );
  }

  // verifica quais barras estão conectadas em uma barra
  LinhasConectadasBarra(barra: Barra): Array<Linha> {
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
   FUNÇÕES DO SVG
  */

  // GRUPOS

  // grupo Geral, contém os outros grupos (desenho, texto e seleção)
  CriaGrupoBarra(barra: Barra, posicao_x?: number, posicao_y?: number, SVGUsado = this.SVGPrincipal as SVG.Doc) {
    const self = this;
    const grupoBarra = SVGUsado.group()
      .id(barra.id_barra)
      .addClass('grupoBarra')
      .move(posicao_x || 0, posicao_y || 0) // move para a posição desejada
      .data('barra', barra) // adiciona o dado da barra
      .click(function (event) {
        if (barra.id_barra) {
          if (event.ctrlKey || event.shiftKey) {
            self.AlternarBarraSelecionada(this);
          }
        }
      }).mouseover(function (event) {
        // console.log('over');
        // if (event.ctrlKey || event.shiftKey) {
        //   self.AlternarBarraSelecionada(this);
        // }

      }).mouseout(function (event) {
        // console.log('out');
        // if (event.ctrlKey || event.shiftKey) {
        //   self.AlternarBarraSelecionada(this);
        // }
        // self.RemoverBarraSelecionada(this);
      })
      ;

    if (SVGUsado.id() === 'svg_principal') {
      grupoBarra.addClass('componente-principal');
    } else if (SVGUsado.id() === 'svg_lateral') {
      grupoBarra.addClass('componente-lateral');
    }
    return grupoBarra;

  }

  // grupo de Seleção
  CriarGrupoBarraSelecao(grupoBarra: SVG.G, SVGUsado = this.SVGPrincipal as SVG.Doc): SVG.G {
    // cria o grupo de seleção
    const grupoBarraSelecao = SVGUsado.group()
      .addClass('grupoBarraSelecao');

    // pega a caixa delimitadora do grupo barra
    const grupoBarraBBox = grupoBarra.bbox();
    grupoBarraSelecao.rect(grupoBarraBBox.w, grupoBarraBBox.h)
      .move(grupoBarraBBox.x, grupoBarraBBox.y)
      .addClass('retanguloSelecao');

    return grupoBarraSelecao;
  }

  // grupo de desenho (circulos, setas, triangulos)
  CriaGrupoBarraDesenho(tipo: EnumTipoBarra, SVGUsado = this.SVGPrincipal as SVG.Doc): SVG.G {
    const grupo = SVGUsado.group();
    if (tipo === EnumTipoBarra.Slack || tipo === EnumTipoBarra.PV) {
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
      grupo.text(tipo === EnumTipoBarra.PV ? '~' : '∞')
        .addClass('barra')
        .addClass('texto')
        .font({ size: 50, family: 'Times New Roman' })
        .move(10, 20); // texto
    } else if (tipo === EnumTipoBarra.PQ) {
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
    if (SVGUsado.id() === 'svg_principal') {
      const box = grupo.bbox();
      grupo.circle(10)
        .addClass('rotacao')
        .move(box.cx - 5, box.cy - 5);
      grupo.circle(10).addClass('criarLinha')
        .move(box.x2 - 5, box.cy - 5);
      grupo.addClass('barra')
        .addClass('grupoBarraDesenho');
    }
    return grupo;
  }

  // atualização do tooltip da barra
  AtualizaToolTipBarra(grupoBarra: SVG.G) {
    const barra: Barra = this.mapaBarras.get(grupoBarra.id());
    grupoBarra.data('toggle', 'tooltip');
    grupoBarra.data('html', 'true');
    grupoBarra.data('placement', 'true');
    grupoBarra.attr('title', `${barra.nome}`);
  }

  // grupo de texto (P,Q, V, T) ...
  AtualizaGrupoBarraTexto(grupoBarra: SVG.G): SVG.G {
    const barra: Barra = this.mapaBarras.get(grupoBarra.id());
    const box = grupoBarra.bbox();
    const grupoTexto = grupoBarra.group();
    // TEM Q PENSAR ONDE VAI FICAR A POSIÇÃO DE CADA ITEM DA BARRA
    grupoTexto.text(barra.nome)
      .id('nome')
      .dx(box.x)
      .dy(box.width * 1.1);

    grupoTexto.text(barra.id_barra.split('_')[1])
      .id('id')
      .dx(box.x - 20)
      .dy(box.cx - 5);

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

    this.AtualizaToolTipBarra(grupoBarra);
    return grupoTexto;
  }

  // calcula ângulo de um deltax e deltay, ceil é multiplicidade
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

  // Ações

  // excluir barra selecionada
  ExcluirBarraSelecionada(grupoBarra: SVG.G) {
    const barra = this.mapaBarras.get(grupoBarra.id());
    this.ExcluirBarra(barra);
  }

  // excluir barras selecionadas
  ExcluirBarrasSelecionadas() {
    const self = this;
    console.log(`excluindo ${self.barrasSelecionadas.length()} barras selecionadas`);
    this.barrasSelecionadas.each(function () {
      self.ExcluirBarraSelecionada(this);
    });
    this.barrasSelecionadas = this.SVGPrincipal.set();
  }

  // selecionar todas as barras da tela
  SelecionarTodasBarras() {
    const self = this;
    this.SVGPrincipal.each(function (c) {
      const componente: SVG.G = this;
      if (componente.hasClass('grupoBarra')) {
        self.AlternarBarraSelecionada(this);
      }
    });
  }

  // "copiar" barras seleciondas
  CopiarBarrasSelecionadas() {
    const self = this;
    this.barrasCopiadas.clear();
    console.log(`copiando ${self.barrasSelecionadas.length()} barras selecionadas`);
    this.barrasSelecionadas.each(function () {
      self.barrasCopiadas.add(this);
    });
  }

  // "recortar" barras selecionadas
  RecortarBarrasSelecionadas() {
    const self = this;
    this.barrasRecortadas.clear();
    console.log(`recortando ${self.barrasSelecionadas.length()} barras selecionadas`);

    this.barrasSelecionadas.each(function () {
      const grupoBarra = this as SVG.G;
      const barraRecortada = grupoBarra.data('barra');

      // console.log(self.linhasConectadasBarra(barraRecortada));
      self.ExcluirLinhas(barraRecortada);
      self.barrasRecortadas.add(this);
      self.mapaGruposSVG.delete(this.id());
      this.remove();
    });
    this.barrasCopiadas = this.SVGPrincipal.set();
    this.LimparBarrasSelecionadas();
  }

  // "colar" barras copiadas ou recortas
  ColarBarras() {
    if (this.podeColar()) {
      const self = this;
      this.LimparBarrasSelecionadas();

      if (this.barrasCopiadas.length() > 0) {
        console.log(`colando ${self.barrasCopiadas.length()} barras copiadas`);

        this.barrasCopiadas.each(function () {
          const grupoBarra = this as SVG.G;
          const barraCopiada: Barra = grupoBarra.data('barra');
          const novaBarra: Barra = self.CopiarBarra(barraCopiada);
          if (novaBarra) {
            self.AdicionarBarra(novaBarra, grupoBarra.x() + 10, grupoBarra.y() + 10, grupoBarra.data('angulo'));
            const novoGrupoBarra = self.mapaGruposSVG.get(novaBarra.id_barra);
            self.AdicionarBarraSelecionada(novoGrupoBarra);
          } else {
            alert(`só pode ter uma ${barraCopiada.tipo}`);
          }
        });
      } else if (this.barrasRecortadas.length() > 0) {
        console.log(`colando ${self.barrasRecortadas.length()} barras recortadas`);

        this.barrasRecortadas.each(function () {
          self.SVGPrincipal.add(this);
          self.mapaGruposSVG.set(this.id(), this);
          self.AdicionarBarraSelecionada(this);

        });
        this.barrasRecortadas = this.SVGPrincipal.set();
      }

    }
  }

  // verifica se é possivel colar
  podeColar() {
    return this.barrasRecortadas.length() > 0 || this.barrasCopiadas.length() > 0;
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
  LimparBarrasSelecionadas() {
    const self = this;
    console.log(`removendo seleção de ${self.barrasSelecionadas.length()} barras`);
    this.SVGPrincipal.each(function (c) {
      self.RemoverBarraSelecionada(this);
    });
    this.barrasSelecionadas = this.SVGPrincipal.set();
  }


  /*
   Interact.js
  */

  // rotacionar componentes
  HabilitarInteractRotacao() {
    const self = this;
    let dx, dy;
    let ceil = 10;
    let grupoBarra: SVG.G, linhasConectadas: Array<Linha> = new Array();

    interact('.rotacao').draggable({
      onstart: function (event) {
        const id_barra = event.target.parentNode.parentNode.id;
        grupoBarra = self.mapaGruposSVG.get(id_barra);
        const barra = self.mapaBarras.get(grupoBarra.id());
        linhasConectadas = self.LinhasConectadasBarra(barra);
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
        grupoBarra.data('angulo', angulo);
        self.DesenhaLinhas(linhasConectadas);
      }
    });
  }

  // seleção e mascara de seleção
  HabilitarInteractSelecao() {
    const self = this;
    let box_x = 1, box_y = 1;
    let box: SVG.Element, x = 0, y = 0, dx, dy;
    this.SVGPrincipal.rect(this.SVGPrincipal.width(), this.SVGPrincipal.height())
      .fill({ color: 'white', opacity: 0 })
      .id('mask_selection');
    interact('#mask_selection').draggable({
      onstart: function (event) {
        // cria um retângulo vazio no cursor do mouse
        x = event.interaction.pointers[0].offsetX;
        y = event.interaction.pointers[0].offsetY;
        box = self.SVGPrincipal.rect(0, 0)
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
        } else {
          box_x = 1;
        }
        // verifica se a distância de y é contrária ao movimento
        if (dy < 0) {
          transform_y = dy;
          dy *= -1;
          box_y = -1;
        } else {
          box_y = 1;
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
        restriction: document.getElementById(this.SVGPrincipal.id()),
      }
    }).styleCursor(false).on('tap', function () { console.log('tap'); self.LimparBarrasSelecionadas(); });

    function verificaBarrasNaSelecao(retanguloSelecao: SVG.Element) {
      self.SVGPrincipal.each(function (c) {
        const componente: SVG.G = this;

        if (componente.hasClass('grupoBarra')) {
          if ((
            (componente.cx() > retanguloSelecao.x()) &&
            (componente.cx() < (retanguloSelecao.x() + box_x * retanguloSelecao.width()))
          ) ||
            (
              (componente.cx() < retanguloSelecao.x()) &&
              (componente.cx() > (retanguloSelecao.x() + box_x * retanguloSelecao.width()))
            )) {
            if ((
              (componente.cy() > retanguloSelecao.y())
              &&
              (componente.cy() < (retanguloSelecao.y() + box_y * retanguloSelecao.height()))
            ) ||
              (
                (componente.cy() > retanguloSelecao.y() + box_y * retanguloSelecao.height())
                &&
                (componente.cy() < retanguloSelecao.y())
              )) {
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

  // adicionar nova linha, puxando através de um ponto
  HabilitarInteractCriarLinha() {
    const self = this;
    let dx, dy, angulo;
    let grupoLinha;
    let deBarra: SVG.G, paraBarra: SVG.G;

    let polilinha: SVG.PolyLine;
    let impedancia: SVG.Element;

    interact('.criarLinha')
      .dropzone({
        accept: '.criarLinha',
        ondragenter: function (event) {
          event.target.classList.remove('criarLinha');
        },
        ondragleave: function (event) {
          event.target.classList.add('criarLinha');
        },
        ondrop: function (event) {
          event.target.classList.add('criarLinha');

          const id_barra = event.target.parentNode.parentNode.id;
          paraBarra = self.mapaGruposSVG.get(id_barra);
          self.AdicionarLinha(deBarra.data('barra'), paraBarra.data('barra'), EnumLinhaTipo.reta);
        },
        ondropactivate: function (event) {
          event.target.classList.add('nova_linha');
        },
        ondropdeactivate: function (event) {
          event.target.classList.remove('nova_linha');
        }
      })
      .draggable({
        onstart: dragstart,
        onmove: dragmove,
        onend: dragend,
        restrict: {
          restriction: document.getElementById(this.SVGPrincipal.id()),
          endOnly: false
        }
      });

    function dragstart(event) {
      grupoLinha = self.SVGPrincipal.group().id('linha_nova') as SVG.G;
      const id_barra = event.target.parentNode.parentNode.id;
      deBarra = self.mapaGruposSVG.get(id_barra);
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
      // grupoLinha.clear();
      grupoLinha.remove();
    }
  }

  // movimentos de arrastar e soltar barras e linhas
  HabilitaInteractMovimento() {
    let grupoBarras: SVG.Set, linhas: Array<Linha> = new Array();
    let boxSelecionados: SVG.Element;
    let tipo;

    const self = this;
    const ceil = 10;
    interact('.componente-principal')
      .draggable({
        inertia: true,
        restrict: {
          restriction: document.getElementById(this.SVGPrincipal.id()),
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        }
      })
      .on('dragstart', dragstart)
      .on('dragmove', dragmove)
      .on('dragend', function () {
        boxSelecionados.remove();
      });

    function dragstart(event) {
      boxSelecionados = self.SVGPrincipal.rect()
        .addClass('grupoSelecionado');
      linhas = new Array();

      grupoBarras = self.SVGPrincipal.set();
      let grupoBarra = self.mapaGruposSVG.get(event.target.id);


      if (self.barrasSelecionadas.length() > 0) {
        grupoBarras = self.barrasSelecionadas;
        if (!self.barrasSelecionadas.has(grupoBarra)) { // caso pegue uma barra q não está na seleção
          self.LimparBarrasSelecionadas();
          grupoBarras.add(grupoBarra);
        } else {
          console.log('arrastando grupo');
          const box = grupoBarras.bbox();
          boxSelecionados
            .width(box.width)
            .height(box.height)
            .move(box.x, box.y);
        }
      } else {
        grupoBarras.add(grupoBarra);
      }
      grupoBarras.each(function (c) {
        grupoBarra = this as SVG.G;
        const barra = self.mapaBarras.get(grupoBarra.id());
        self.LinhasConectadasBarra(barra).forEach(linha => {
          if (linhas.indexOf(linha) === -1) {
            linhas.push(linha);
          }
        });
      });
    }

    function dragmove(event) {
      grupoBarras.each(function () {
        this.dx(event.dx).dy(event.dy);
      });
      boxSelecionados.dx(event.dx)
        .dy(event.dy);
      self.DesenhaLinhas(linhas);
    }

    interact('.componente-lateral').draggable({

      inertia: true, // enable inertial throwing
      restrict: {
        endOnly: true,
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
      }
    })
      .on('dragstart', function (event) {
        grupoBarras = self.SVGLateral.set();
        tipo = event.target.id;
        const barra = self.CriarBarra(tipo);
        if (barra) {
          self.AdicionarBarra(barra, -100, event.y0 - 180);
          event.target.id = barra.id_barra;
          dragstart(event);
        }
      })
      .on('dragmove', dragmove)
      .on('dragend', function (event) {
        const barraGrupo = self.mapaGruposSVG.get(event.target.id);
        if (barraGrupo) {
          if (barraGrupo.x() < 0) {
            barraGrupo.x(10);
          }
          if (barraGrupo.y() < 0) {
            barraGrupo.y(80);
          }
        }
        event.target.id = tipo;
        boxSelecionados.remove();
      });


    let grupoCurto: SVG.G;
    interact('.curtoCircuito').draggable({
      inertia: true
    }).on('dragstart', function (event) {
      grupoCurto = self.CriarCurtoCircuito();
      grupoCurto.x(-175);
      grupoCurto.y(event.y0 - 130);
    })
      .on('dragmove', function (event) {
        grupoCurto.dx(event.dx);
        grupoCurto.dy(event.dy);
      })
      .on('dragend', function (event) {
        grupoCurto.remove();
      });
  }

  HabilitarInteractCriarCurto() {
    const self = this;

    interact('.transmissao, .retanguloSelecao').dropzone({
      accept: '.curtoCircuito',
      ondragenter: function (event) {
        event.target.classList.add('enter');
        event.target.classList.remove('active');
      },
      ondragleave: function (event) {
        event.target.classList.remove('enter');
        event.target.classList.add('active');
      },
      ondrop: function (event) {
        event.target.classList.remove('enter');
        event.target.classList.remove('active');
        const id_elemento: string = event.target.parentNode.parentNode.id;
        self.curto.barra = self.mapaBarras.get(id_elemento);
        self.curto.linha = self.mapaLinhas.get(id_elemento);
        self.AdicionarCurto();
      },
      ondropactivate: function (event) {
        event.target.classList.add('active');
        event.target.classList.remove('enter');

      },
      ondropdeactivate: function (event) {
        event.target.classList.remove('active');
        event.target.classList.remove('enter');
      }
    }
    );
  }

  /*
   Atalhos do teclado
 */
  ConfigurarAtalhosTeclado() {
    const self = this;
    $('#svg_principal').hover(function () {
      this.focus();
    }, function () {
      this.blur();
    }).keydown(function (e) {
      switch (e.keyCode) {
        case 27:
          console.log('esc');
          self.LimparBarrasSelecionadas();
          break;
        case 46:
          console.log('del');
          self.ExcluirBarrasSelecionadas();
          break;
      }
      if (e.ctrlKey) {
        console.log('ctrl');
        switch (e.keyCode) {
          case 65: // ctrl a
            console.log('a');
            self.SelecionarTodasBarras();
            break;
          case 67: // ctrl c
            console.log('c');
            self.CopiarBarrasSelecionadas();
            break;
          case 88: // ctrl x
            console.log('x');
            self.RecortarBarrasSelecionadas();
            break;
          case 86: // ctrl v
            console.log('v');
            self.ColarBarras();
            break;
        }
      }
    });
  }

}
