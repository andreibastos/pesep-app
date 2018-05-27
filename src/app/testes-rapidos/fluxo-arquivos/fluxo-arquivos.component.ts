import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { utils, element } from 'protractor';
import { read } from 'fs';
import { Linha } from '../../models/linha';
import { Barra } from './../../models/barra';

@Component({
  selector: 'app-fluxo-arquivos',
  templateUrl: './fluxo-arquivos.component.html',
  styleUrls: ['./fluxo-arquivos.component.css']
})
export class FluxoArquivosComponent implements OnInit {

  // Arquivos realmente lidos, cada array é é um array de strings
  arquivoLinha = [];
  arquivoBarra = [];

  linhas: Array<Linha> = new Array(); // Array de linhas (baseado no modelo)
  barras: Array<Barra> = new Array(); // Array de barra (baseado no modelo)

  // Flags para saber se os arquivos de linha e de barra foram carregados com sucesso
  linhaSucesso = false;
  barraSucesso = false;

  // evento emissor. emite arquivoLinha e o arquivoBarra
  @Output() arquivosCarregados = new EventEmitter();


  // Converte o texto separado por quebras de linha (\n) por um array [["item1", "item2", ...]]
  static TextoParaLista(texto, tamanhoColuna) {
    // texto: Texto a ser quebrado em array.
    // tamanhoColuna: indica o número de colunas que deve ter cada linha.

    const dados = []; // dados a serem enviados para quem chama essa função
    const delimitador = ','; // delimitador de csv (para quebrar as colunas)
    const linhas = texto.split('\n'); // quebra o texto em linhas

    linhas.forEach(linha => { // para cada linha em linhas
      const colunas = linha.split(delimitador); // quebra de acordo com o delimitador
      if (colunas.length === tamanhoColuna) { // verifica o tamanho das colunas
        dados.push(colunas); // adiciona na lista de dados;
      }
    });
    return dados; // retorna os dados para quem o chama
  }

  // contrutor vazio por enquanto.
  constructor() { }

  // sobrecarga de método, padrão do angularJS.
  ngOnInit() {
  }

  // Evento quando carrega novo arquivo
  carregouNovoArquivo() {
    if (this.linhaSucesso && this.barraSucesso) { // verifica se os arquivos de linha e de barra têm sucesso
      this.arquivosCarregados.emit({ linhas: this.arquivoLinha, barras: this.arquivoBarra }); // envia o evento com os arquivos
    }
  }

  clean_lines_file(data, index) {
    for (let i = 0; i < data.length; i++) {
      data[i] = data[i].replace('\n', '').replace('\r', '');
      if (index > 1) {

        const temp_data = parseFloat(data[i]);
        if (!isNaN(temp_data)) {
          data[i] = temp_data;
        }
      }
    }
    return data;
  }

  getData(arquivoLido, tipo) {
    const fileReader = new FileReader();

    // Read file into memory as UTF-8
    fileReader.readAsText(arquivoLido, 'UTF-8');

    // Handle progress, success, and errors
    fileReader.onprogress = this.updateProgress;
    // fileReader.onload = this.loaded;
    fileReader.onerror = this.errorHandler;


    // instância de si próprio.
    const self = this;



    fileReader.onload = function (evt) {
      if (tipo === 'linha') {
        self.arquivoLinha = [];

        const dados = FluxoArquivosComponent.TextoParaLista(evt.target['result'], 7);
        self.linhas = new Array();
        dados.forEach((dado, index) => {
          dado = self.clean_lines_file(dado, index);
          self.arquivoLinha.push(dado);
          const linha = new Linha();
          if (index > 0) {
            linha.novaLinha(dado);
            self.linhas.push(linha);
          }
        });
        self.linhaSucesso = true;
      } else if (tipo === 'barra') {
        self.arquivoBarra = [];

        const dados = FluxoArquivosComponent.TextoParaLista(evt.target['result'], 14);

        self.barras = new Array();
        dados.forEach((dado, index) => {
          dado = self.clean_lines_file(dado, index);
          self.arquivoBarra.push(dado);
          const barra = new Barra();
          if (index > 0) {
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
    if (evt.target.error.name === 'NotReadableError') {
      // The file could not be read
    }
  }

  lerArquivo(idArquivoAlterado) {

    // https://www.w3.org/TR/FileAPI/#ref-for-dfn-filefileReader-1
    const files = (<HTMLInputElement>document.getElementById(idArquivoAlterado)).files;
    if (files.length > 0) {
      const file = files[0];
      const tipo = idArquivoAlterado === 'arquivoLinha' ? 'linha' : 'barra';
      this.getData(file, tipo);
    }

  }

}
