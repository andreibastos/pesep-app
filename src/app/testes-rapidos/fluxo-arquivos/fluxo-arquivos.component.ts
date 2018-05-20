import { Barra } from './../../models/barra';
import { Component, OnInit } from '@angular/core';
import { utils } from 'protractor';
import { read } from 'fs';
import { Linha } from '../../models/linha';


@Component({
  selector: 'app-fluxo-arquivos',
  templateUrl: './fluxo-arquivos.component.html',
  styleUrls: ['./fluxo-arquivos.component.css']
})
export class FluxoArquivosComponent implements OnInit {

  dados_carregados = [];
  linhas: Array<Linha> = new Array();
  barras: Array<Barra> = new Array();

  static TextoParaLista(texto) {
    const dados = [];
    const delimitador = ',';
    const linhas = texto.split('\n');

    linhas.forEach(linha => {
      const colunas = linha.split(delimitador);
      console.log(colunas);
      if (colunas.length >= 7) {
        dados.push(colunas);
      }
    });
    return dados;
  }


  constructor() { }

  ngOnInit() {
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
      const dados = FluxoArquivosComponent.TextoParaLista(evt.target['result']);
      if (tipo === 'linha') {
        self.linhas = new Array();
        dados.forEach((dado, index) => {
          const linha = new Linha();
          if (index > 1) {
            linha.novaLinha(dado);
            self.linhas.push(linha);
          }
        });
      } else if (tipo === 'barra') {
        self.barras = new Array();
        dados.forEach((dado, index) => {
          const barra = new Barra();
          if (index > 1) {
            barra.novaBarra(dado);
            self.barras.push(barra);
          }
        });
      }
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

  loaded(evt) {
    let dados = [];
    // Obtain the read file data
    const texto = evt.target['result'];
    dados = FluxoArquivosComponent.TextoParaLista(texto);
    return dados;
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
