import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

// Bibliotecas externas
import * as $ from 'jquery';
import * as interact from 'interactjs';
import * as SVG from 'svg.js';

// Classes Internas
import { EnumLinhaTipo, EnumTipoBarra } from './../models/componente';
import { Barra } from './models/barra';
import { Linha } from './models/linha';
import { Curto } from './models/curto';

@Component({
  selector: 'app-diagrama',
  templateUrl: './diagrama.component.html',
  styleUrls: ['./diagrama.component.css']
})

export class DiagramaComponent implements OnInit {


  exemplo: number;

  // Elementos do Sistema Elétrico de Potência
  // private curto: Curto = new Curto();
  private slack: Barra = null;

  // Dicionários para busca mais rápidas
  private mapaBarras: Map<string, Barra> = new Map();
  private mapaLinhas: Map<string, Linha> = new Map();
  linhaSelecionada: Linha = null;

  // Controle de identificação
  private qtdBarrasTipo = {};
  private qtdBarrasTotal = 1;
  enumerador_barra = EnumTipoBarra; // para usar no HTML

  // Controle do SVG
  SVGPrincipal: SVG.Doc;
  SVGLateral: SVG.Doc;
  mapaGruposSVG: Map<string, SVG.G> = new Map();

  // controle de seleção
  private barrasSelecionadasSVG: SVG.Set;
  private linhasSelecionadasSVG: SVG.Set;


  // controle de copiar/recortar
  barrasCopiadasSVG: SVG.Set;
  barrasRecortadasSVG: SVG.Set;

  // Propriedades do Diagrama
  propriedades_diagrama = { visualizar_grade: true, agarrar_grade: false }; // Propriedades do diagrama

  constructor(private route: ActivatedRoute) {
    this.qtdBarrasTipo[EnumTipoBarra.PV] = 1;
    this.qtdBarrasTipo[EnumTipoBarra.PQ] = 1;
    this.qtdBarrasTipo[EnumTipoBarra.Slack] = 1;
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

    this.route.queryParams.subscribe(
      (queryParams: any) => {
        try {
          this.exemplo = parseInt(queryParams['exemplo'], 10);
        } catch (e) {
          this.exemplo = undefined;
        }
      }
    );
    // desenha um exemplo na tela
    if (this.exemplo) {
      console.log(this.exemplo);
      this.DesenharExemplo();
    }
  }

  DesenharExemplo() {
    if (this.exemplo === 1) {
      const barra1 = this.CriarBarra(EnumTipoBarra.PV);
      const barra2 = this.CriarBarra(EnumTipoBarra.PQ);
      const barra3 = this.CriarBarra(EnumTipoBarra.PQ);
      const barra4 = this.CriarBarra(EnumTipoBarra.Slack);

      this.AdicionarBarra(barra1, 300, 100, 90);
      this.AdicionarBarra(barra2, 900, 100, 90);
      this.AdicionarBarra(barra4, 300, 600, -90);
      this.AdicionarBarra(barra3, 900, 600, -90);

      this.AdicionarLinha(barra1, barra2);
      this.AdicionarLinha(barra1, barra3);
      this.AdicionarLinha(barra1, barra4);

      this.AdicionarLinha(barra2, barra3);

      this.AdicionarLinha(barra3, barra4);



    } else if (this.exemplo === 2) {

      const barra1 = this.CriarBarra(EnumTipoBarra.Slack);
      const barra2 = this.CriarBarra(EnumTipoBarra.PQ);
      const barra3 = this.CriarBarra(EnumTipoBarra.PQ);

      this.AdicionarBarra(barra1, 400, 400);
      this.AdicionarBarra(barra2, 800, 400, 180);
      this.AdicionarBarra(barra3, 1200, 400, 180);

      this.AdicionarLinha(barra1, barra2);
      this.AdicionarLinha(barra2, barra3);

    } else if (this.exemplo === 3) {
      const barra1 = this.CriarBarra(EnumTipoBarra.Slack);
      const barra2 = this.CriarBarra(EnumTipoBarra.PQ);
      const barra3 = this.CriarBarra(EnumTipoBarra.PQ);
      const barra4 = this.CriarBarra(EnumTipoBarra.PV);


      this.AdicionarBarra(barra1, 300, 100, 90);
      this.AdicionarBarra(barra2, 300, 600, -90);
      this.AdicionarBarra(barra3, 900, 100, 90);
      this.AdicionarBarra(barra4, 900, 600, -90);

      this.AdicionarLinha(barra1, barra2);
      this.AdicionarLinha(barra1, barra3);
      this.AdicionarLinha(barra2, barra4);
      this.AdicionarLinha(barra3, barra4);
    } else if (this.exemplo === 4) {
      const barra1 = this.CriarBarra(EnumTipoBarra.Slack, 'Birch');
      const barra2 = this.CriarBarra(EnumTipoBarra.PQ, 'Elm');
      const barra3 = this.CriarBarra(EnumTipoBarra.PV, 'Mapie');
      const barra4 = this.CriarBarra(EnumTipoBarra.PQ, 'Oak');
      const barra5 = this.CriarBarra(EnumTipoBarra.PQ, 'Pine');


      this.AdicionarBarra(barra1, 400, 50, 90);
      this.AdicionarBarra(barra2, 800, 50, 90);
      this.AdicionarBarra(barra3, 800, 400, -90);
      this.AdicionarBarra(barra4, 400, 700, -90);
      this.AdicionarBarra(barra5, 400, 400, -90);

      this.AdicionarLinha(barra1, barra2);
      this.AdicionarLinha(barra1, barra5);
      this.AdicionarLinha(barra2, barra3);
      this.AdicionarLinha(barra3, barra4);
      this.AdicionarLinha(barra4, barra5);
      this.AdicionarLinha(barra5, barra3);


    }


  }

  AtualizarBarras(barrasAtualizadas: Array<Barra>) {
    barrasAtualizadas.forEach(barra => {
      this.mapaBarras.set(barra.id_barra, barra);
      const grupoBarra = this.mapaGruposSVG.get(barra.id_barra);
      this.AtualizaGrupoBarraTexto(grupoBarra);
    });

    this.LimparSelecionados();
  }
  AtualizarLinha(linhaAtualizada: Linha) {

    linhaAtualizada.de = this.linhaSelecionada.de;
    linhaAtualizada.para = this.linhaSelecionada.para;

    this.mapaLinhas.set(linhaAtualizada.id_linha, linhaAtualizada);
    this.linhaSelecionada = null;
    this.DesenhaLinha(linhaAtualizada);
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
      this.barrasSelecionadasSVG = this.SVGPrincipal.set();
      this.barrasCopiadasSVG = this.SVGPrincipal.set();
      this.barrasRecortadasSVG = this.SVGPrincipal.set();

    } else if (SVGNome === 'svg_lateral') {

      this.SVGLateral = SVG(SVGNome)
        .id('svg_lateral')
        // .addClass('svg_area')
        .size(width, height - 100);
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

  // AdicionarCurto() {

  //   const self = this;
  //   const curto: Curto = this.curto;
  //   if (curto.linha) {
  //     const grupoLinha = this.mapaGruposSVG.get(`${curto.linha.id_linha}`);
  //     grupoLinha.select('.polilinha').each(function () {
  //       const grupoCurto = self.CriarCurtoCircuito();
  //       const grupoPolilinha = this.add(grupoCurto) as SVG.G;
  //       const rect = grupoPolilinha.get(1);
  //       grupoCurto.cx(rect.cx() - 20).cy(rect.cy());
  //     });

  //   } else if (curto.barra) {
  //     const grupoBarra = this.mapaGruposSVG.get(`${curto.barra.id_barra}`);
  //     // console.log(`adicionando curto na ${curto.barra.nome}`);
  //   }
  // }


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
  CriarBarra(tipo: EnumTipoBarra, nome?: string): Barra {
    // Sistema Elétrico de Potência
    const barra: Barra = new Barra(tipo); // cria uma nova barra com o tipo associado
    barra.id_barra = `barra_${this.qtdBarrasTotal}`; // atualiza o identificador
    if (nome) {
      barra.nome = nome;
    } else {
      // barra.nome = `${tipo.toString()} ${this.qtdBarrasTipo[tipo]}`;

    }
    if (tipo === EnumTipoBarra.Slack) {
      if (!nome) {
        barra.nome = `${tipo.toString()}`;
      }
      if (!this.slack) {
        this.slack = barra;
      } else {
        return null;
      }
    }
    this.IncrementaBarra(barra.tipo); // incremmenta o numero de barras
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
    console.log(barra.tipo === EnumTipoBarra.Slack);

    if (barra.tipo === EnumTipoBarra.Slack) {
      this.slack = null;
    }
    this.mapaGruposSVG.get(barra.id_barra).remove();
    this.mapaGruposSVG.delete(barra.id_barra);
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
    this.mapaLinhas.set(linha.id_linha, linha);
    this.DesenhaLinha(linha, enumLinhaTipo);
  }

  // excluindo linhas na tela
  ExcluirLinhas(barra: Barra) {
    const paraRemover: Array<Linha> = new Array();
    this.mapaLinhas.forEach((linha) => {
      if (linha.de.id_barra === barra.id_barra || linha.para.id_barra === barra.id_barra) {
        this.mapaGruposSVG.get(linha.id_linha).remove();
        paraRemover.push(linha);
      }
    });
    console.log(`excluindo ${paraRemover.length} linhas associadas a barra ${barra.id_barra}`);

    paraRemover.forEach(linha => {
      this.mapaLinhas.delete(linha.id_linha);
      this.mapaGruposSVG.delete(linha.id_linha);
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
    const self = this;
    // remover linha existente com o mesmo identificador
    const selecao = this.SVGPrincipal.select(`#${linha.id_linha}`);
    selecao.each(function () { this.remove(); });

    // cria um grupo novo para a linha
    const grupoLinha = this.SVGPrincipal.group().id(linha.id_linha);

    // verificar se existe curto nessa linha



    const poliLinha: SVG.G = grupoLinha.group().addClass('polilinha');
    const impedancia: SVG.G = grupoLinha.group();
    // let grupoCurto: SVG.G;

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
      grupoLinha.data('angulo', angulo)
        .click(function () {
          self.AlternarLinhaSelecionada(grupoLinha);
        }
        ).style({ 'cursor': 'pointer' });

    } else if (enumLinhaTipo === EnumLinhaTipo.poliretas) {
      poliLinha.polyline(this.CriarPoliLinha(delta_x, delta_y, 15));
    }

    // if (this.curto.linha) {
    //   if (this.curto.linha.id_linha === linha.id_linha) {
    //     grupoCurto = poliLinha.group().addClass('curtoCircuito');
    //     const largura = 40;
    //     grupoCurto.addClass('curtoCircuito');
    //     grupoCurto.line(0, 0, largura, largura);
    //     grupoCurto.line(0, largura, largura, 0);
    //     grupoCurto.circle(largura / 5)
    //       .cx(largura / 2)
    //       .cy(largura / 2);
    //     grupoCurto.cx(-this.curto.afastamento * hipotenusa * Math.cos(angulo * Math.PI / 180));
    //     grupoCurto.cy(-this.curto.afastamento * hipotenusa * Math.sin(angulo * Math.PI / 180));
    //     grupoCurto.rotate(angulo);
    //   }
    // }

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
    this.mapaLinhas.forEach(
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
    const grupoBarraSelecao = SVGUsado.group().id('grupoBarraSelecao')
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
    const grupo = SVGUsado.group().id('grupoBarraDesenho');
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
    const barra: Barra = this.getBarra(grupoBarra.id());
    grupoBarra.data('toggle', 'tooltip');
    grupoBarra.data('html', 'true');
    grupoBarra.data('placement', 'true');
    grupoBarra.attr('title', `${barra.nome}`);
  }

  getBarra(id_barra: string): Barra {
    const barra: Barra = this.mapaBarras.get(id_barra);
    return barra;
  }

  // grupo de texto (P,Q, V, T) ...
  AtualizaGrupoBarraTexto(grupoBarra: SVG.G): SVG.G {
    const barra: Barra = this.getBarra(grupoBarra.id());
    grupoBarra.select('#grupoBarraTexto').each(function () {
      this.remove();
    });

    const box = grupoBarra.get(0).bbox();
    const grupoTexto = grupoBarra.group()
      .id('grupoBarraTexto')
      .backward();
    const options = {
      family: 'Helvetica',
      size: 20,
      archor: 'end',
      'font-weight': 'bold'
    };

    grupoTexto.text(barra.tipo)
      .id('tipo')
      .cx(box.x2)
      .cy(box.y2 + 5)
      .font(options);

    grupoTexto.text(barra.id_barra.split('_')[1])
      .id('id')
      .cx(box.x - 10)
      .dy(box.cy - 5)
      .font(options);

    options['font-weight'] = 'normal';
    grupoTexto.text(barra.nome)
      .id('nome')
      .cx(box.x2 + 20)
      .cy(box.cy)
      .font(options);




    // grupoBarra.rect(box.w, box.h).fill({ opacity: 0.1 });

    // grupoTexto.text(barra.nome)
    //   .id('nome')
    //   .dx(box.x)
    //   .dy(box.width * 1.1);

    // grupoTexto.text(barra.id_barra.split('_')[1])
    //   .id('id')
    //   .dx(box.x - 20)
    //   .dy(box.cx - 5);

    // grupoTexto.text(`P=${barra.pCarga} pu`)
    //   .id('P')
    //   .dx(-box.height * 0.1)
    //   .dy(-box.width * 0.5);

    // grupoTexto.text(`Q=${barra.qCarga} pu`)
    //   .id('Q')
    //   .dx(-box.height * 0.1)
    //   .dy(-box.width * 0.3);

    // grupoTexto.text(`${barra.tensao_0}∠${barra.angulo_0}° pu`)
    //   .id('PV')
    //   .dy(-box.width * 0.15)
    //   .dx(box.height * 0.7);

    // this.AtualizaToolTipBarra(grupoBarra);
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
    this.barrasSelecionadasSVG.add(grupoBarra);
  }

  AdicionarLinhaSelecionada(grupoLinha: SVG.G) {
    if (!grupoLinha.hasClass('grupoLinha')) {
      return;
    }
    const grupoLinhaSelecao = grupoLinha.get(2) as SVG.G;
    if (grupoLinhaSelecao) {
      grupoLinhaSelecao.addClass('selecionado');
    }
    this.linhasSelecionadasSVG.add(grupoLinha);
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
    this.barrasSelecionadasSVG.remove(grupoBarra);
  }

  // Ações

  // excluir barra selecionada
  ExcluirBarraSelecionada(grupoBarra: SVG.G) {
    const barra = this.getBarra(grupoBarra.id());
    this.ExcluirBarra(barra);
  }

  // excluir barras selecionadas
  ExcluirBarrasSelecionadas() {
    const self = this;
    console.log(`excluindo ${self.barrasSelecionadasSVG.length()} barras selecionadas`);
    this.barrasSelecionadasSVG.each(function () {
      self.ExcluirBarraSelecionada(this);
    });
    this.barrasSelecionadasSVG = this.SVGPrincipal.set();
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

  BarrasSelecionadas(): Array<Barra> {
    const self = this;
    const barrasSelecionadas: Array<Barra> = new Array();
    if (this.barrasSelecionadasSVG.length() > 0) {
      this.barrasSelecionadasSVG.each(function () {
        barrasSelecionadas.push(self.getBarra(this.id()));
      });
    }
    return barrasSelecionadas;
  }

  LinhaSelecionada(): boolean {
    return this.linhaSelecionada === null;
  }

  // "copiar" barras seleciondas
  CopiarBarrasSelecionadas() {
    const self = this;
    this.barrasCopiadasSVG.clear();
    console.log(`copiando ${self.barrasSelecionadasSVG.length()} barras selecionadas`);
    this.barrasSelecionadasSVG.each(function () {
      self.barrasCopiadasSVG.add(this);
    });
  }

  // "recortar" barras selecionadas
  RecortarBarrasSelecionadas() {
    const self = this;
    this.barrasRecortadasSVG.clear();
    console.log(`recortando ${self.barrasSelecionadasSVG.length()} barras selecionadas`);

    this.barrasSelecionadasSVG.each(function () {
      const grupoBarra = this as SVG.G;
      const barraRecortada: Barra = self.getBarra(this.id());
      self.ExcluirLinhas(barraRecortada);
      if (barraRecortada.tipo === EnumTipoBarra.Slack) {
        self.slack = null;
      }
      self.barrasRecortadasSVG.add(this);
      this.remove();
    });
    this.barrasCopiadasSVG = this.SVGPrincipal.set();
    this.LimparSelecionados();
  }

  // "colar" barras copiadas ou recortas
  ColarBarras() {
    if (this.podeColar()) {
      const self = this;
      this.LimparSelecionados();

      if (this.barrasCopiadasSVG.length() > 0) {
        console.log(`colando ${self.barrasCopiadasSVG.length()} barras copiadas`);

        this.barrasCopiadasSVG.each(function () {
          const grupoBarra = this as SVG.G;
          const barraCopiada: Barra = self.getBarra(this.id());
          const novaBarra: Barra = self.CopiarBarra(barraCopiada);
          console.log(novaBarra);
          if (novaBarra) {
            self.AdicionarBarra(novaBarra, grupoBarra.x() + 10, grupoBarra.y() + 10, grupoBarra.data('angulo'));
            const novoGrupoBarra = self.mapaGruposSVG.get(novaBarra.id_barra);
            self.AdicionarBarraSelecionada(novoGrupoBarra);
          } else {
            alert(`só pode ter uma ${barraCopiada.tipo}`);
          }
        });
      } else if (this.barrasRecortadasSVG.length() > 0) {
        console.log(`colando ${self.barrasRecortadasSVG.length()} barras recortadas`);

        this.barrasRecortadasSVG.each(function () {
          const grupoBarra = this as SVG.G;
          const barraColada: Barra = self.getBarra(this.id());
          if (barraColada.tipo === EnumTipoBarra.Slack) {
            if (self.slack) {

            } else {
              self.slack = barraColada;
              self.SVGPrincipal.add(this);
              self.mapaGruposSVG.set(this.id(), this);
              self.AdicionarBarraSelecionada(this);
            }
          } else {

            self.SVGPrincipal.add(this);
            self.mapaGruposSVG.set(this.id(), this);
            self.AdicionarBarraSelecionada(this);
          }

        });
        this.barrasRecortadasSVG = this.SVGPrincipal.set();
      }

    }
  }

  // verifica se é possivel colar
  podeColar() {
    return this.barrasRecortadasSVG.length() > 0 || this.barrasCopiadasSVG.length() > 0;
  }


  // muda o item selecionado, (se está selecionado passa a não ser, e vice versa)
  AlternarBarraSelecionada(grupo: SVG.G) {
    if (this.barrasSelecionadasSVG.has(grupo)) {
      this.RemoverBarraSelecionada(grupo);
    } else {
      this.AdicionarBarraSelecionada(grupo);
    }
  }

  AlternarLinhaSelecionada(grupo: SVG.G) {
    const linha = this.mapaLinhas.get(grupo.id());
    if (this.linhaSelecionada === linha) {
      this.linhaSelecionada = null;
    } else {
      this.linhaSelecionada = null;
      this.linhaSelecionada = linha;
    }
  }

  // limpa a seleção
  LimparBarrasSelecionadas() {
    const self = this;
    console.log(`removendo seleção de ${self.barrasSelecionadasSVG.length()} barras`);
    this.SVGPrincipal.each(function (c) {
      self.RemoverBarraSelecionada(this);
    });
    this.barrasSelecionadasSVG = this.SVGPrincipal.set();
  }

  LimparLinhasSelecionadas() {
    this.linhaSelecionada = null;
  }

  LimparSelecionados() {
    this.LimparBarrasSelecionadas();
    this.LimparLinhasSelecionadas();
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
        const barra = self.getBarra(grupoBarra.id());
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
    }).styleCursor(false).on('tap', function () { console.log('tap'); self.LimparSelecionados(); });

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
              if (!self.barrasSelecionadasSVG.has(componente)) {
                self.AdicionarBarraSelecionada(componente);
              }
            } else {
              if (self.barrasSelecionadasSVG.has(componente)) {
                self.RemoverBarraSelecionada(componente);
              }
            }
          } else {
            if (self.barrasSelecionadasSVG.has(componente)) {
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
    let retanguloSelecaoRelatedTarget: SVG.Element;
    let deBarra: SVG.G, paraBarra: SVG.G;

    let polilinha: SVG.PolyLine;
    let impedancia: SVG.Element;

    interact('.retanguloSelecao')
      .dropzone({
        accept: '.criarLinha',
        ondragenter: function (event) {
          event.target.classList.add('enter');
          event.target.classList.remove('active');

        },
        ondragleave: function (event) {
          event.target.classList.remove('enter');
          event.target.classList.add('active');
        },
        ondrop: function (event) {
          const id_barra_para = event.target.parentNode.parentNode.id;
          paraBarra = self.mapaGruposSVG.get(id_barra_para);
          if (deBarra.id() !== paraBarra.id()) {
            const de = self.getBarra(deBarra.id());
            const para = self.getBarra(paraBarra.id());
            self.AdicionarLinha(de, para, EnumLinhaTipo.reta);
          }
          event.target.classList.remove('active');
          event.target.classList.remove('enter');
          retanguloSelecaoRelatedTarget.addClass('retanguloSelecao');
        },
        ondropactivate: function (event) {
          const grupoBarraRelatedTarget = self.mapaGruposSVG.get(deBarra.id());
          const grupoSelecaoRelatedTarget = grupoBarraRelatedTarget.last() as SVG.G;
          retanguloSelecaoRelatedTarget = grupoSelecaoRelatedTarget.last();
          retanguloSelecaoRelatedTarget.removeClass('retanguloSelecao');
          event.target.classList.add('active');
          event.target.classList.remove('enter');
        },
        ondropdeactivate: function (event) {
          event.target.classList.remove('active');
          event.target.classList.remove('enter');
        }
      });

    interact('.criarLinha')
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
      grupoLinha.remove();
      retanguloSelecaoRelatedTarget.addClass('retanguloSelecao');

    }
  }

  // movimentos de arrastar e soltar barras e linhas
  HabilitaInteractMovimento() {
    let grupoBarras: SVG.Set, linhas: Array<Linha> = new Array();
    let tipo;

    const self = this;
    let boxSelecionados: SVG.Element = self.SVGPrincipal.rect()
      .addClass('grupoSelecionado');
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


      if (self.barrasSelecionadasSVG.length() > 0) {
        grupoBarras = self.barrasSelecionadasSVG;
        if (!self.barrasSelecionadasSVG.has(grupoBarra)) { // caso pegue uma barra q não está na seleção
          self.LimparSelecionados();
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
        const barra = self.getBarra(grupoBarra.id());
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
      if (boxSelecionados) {
        boxSelecionados.dx(event.dx)
          .dy(event.dy);
        self.DesenhaLinhas(linhas);
      }
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
        } else {
          // alert(`só pode ter uma ${tipo}`);
          console.log(self.slack);
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
        // self.curto.barra = self.getBarra(id_elemento);
        // self.curto.linha = self.mapaLinhas.get(id_elemento);
        // self.AdicionarCurto();
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
          self.LimparSelecionados();
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
