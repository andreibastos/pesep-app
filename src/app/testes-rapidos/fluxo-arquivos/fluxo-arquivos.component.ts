import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { utils } from 'protractor';
import { read } from 'fs';
import { Linha } from '../../models/linha';
import { Barra } from './../../models/barra';


@Component({
  selector: 'app-fluxo-arquivos',
  templateUrl: './fluxo-arquivos.component.html',
  styleUrls: ['./fluxo-arquivos.component.css']
})
export class FluxoArquivosComponent implements OnInit {

  dados_carregados = [];
  linhas: Array<Linha> = new Array();
  barras: Array<Barra> = new Array();
  linhaSucesso = false;
  barraSucesso = false;
  @Output() arquivosCarregados = new EventEmitter();



  static TextoParaLista(texto, tamanhoMinimo) {
    const dados = [];
    const delimitador = ',';
    const linhas = texto.split('\n');

    linhas.forEach(linha => {
      const colunas = linha.split(delimitador);
      if (colunas.length === tamanhoMinimo) {
        dados.push(colunas);
        console.log(colunas);
      }
    });
    return dados;
  }

  constructor() { }

  ngOnInit() {
  }

  carregouNovoArquivo() {
    if (this.linhaSucesso && this.barraSucesso) {
      this.arquivosCarregados.emit({ linhas: this.linhas, barras: this.barras });
      console.log('passou aqui');
    }
  }

  getData(readFile, tipo) {
    const reader = new FileReader();

    // Read file into memory as UTF-8
    reader.readAsText(readFile, 'UTF-8');

    // Handle progress, success, and errors
    reader.onprogress = this.updateProgress;
    // reader.onload = this.loaded;
    reader.onerror = this.errorHandler;

    const self = this;

    reader.onload = function (evt) {
      if (tipo === 'linha') {
        const dados = FluxoArquivosComponent.TextoParaLista(evt.target['result'], 7);
        self.linhas = new Array();
        dados.forEach((dado, index) => {
          const linha = new Linha();
          if (index > 1) {
            linha.novaLinha(dado);
            self.linhas.push(linha);
          }
        });
        self.linhaSucesso = true;
      } else if (tipo === 'barra') {
        const dados = FluxoArquivosComponent.TextoParaLista(evt.target['result'], 14);

        self.barras = new Array();
        dados.forEach((dado, index) => {
          const barra = new Barra();
          if (index > 1) {
            barra.novaBarra(dado);
            self.barras.push(barra);
          }
        });
        self.barraSucesso = true;
      }
      self.carregouNovoArquivo();
    };

  }

  updateProgress(evt) {
    if (evt.lengthComputable) {
      // evt.loaded and evt.total are ProgressEvent properties
      const loaded = (evt.loaded / evt.total);
      if (loaded < 1) {
        // Increase the prog bar length
        // style.width = (loaded * 200) + "px";
      }
      console.log(loaded);
    }
  }


  errorHandler(evt) {
    console.log(evt);
    if (evt.target.error.name === 'NotReadableError') {
      // The file could not be read
    }
  }

  lerArquivo(idArquivoAlterado) {
    console.log(idArquivoAlterado);

    // https://www.w3.org/TR/FileAPI/#ref-for-dfn-filereader-1

    const files = (<HTMLInputElement>document.getElementById(idArquivoAlterado)).files;
    if (files.length > 0) {
      const file = files[0];
      const tipo = idArquivoAlterado === 'arquivoLinha' ? 'linha' : 'barra';
      this.getData(file, tipo);
    }

  }

}
