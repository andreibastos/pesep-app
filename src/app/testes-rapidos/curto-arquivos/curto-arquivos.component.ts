import { DataUpload } from './../../utils/data-upload';
import { Conversion } from './../../utils/conversions';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-curto-arquivos',
  templateUrl: './curto-arquivos.component.html',
  styleUrls: ['./curto-arquivos.component.css']
})
export class CurtoArquivosComponent implements OnInit {
  // Arquivos realmente lidos, cada array é é um array de strings
  // arquivos: Map<string, Array<any>> = new Map();
  arquivos = {};

  // evento emissor. emite arquivoLinha e o arquivoBarra
  @Output() filesLoadedEmit = new EventEmitter();

  // contrutor vazio por enquanto.
  constructor() { }

  // sobrecarga de método, padrão do angularJS.
  ngOnInit() {
  }

  // Evento quando carrega novo arquivo
  filesLoaded() {
    this.filesLoadedEmit.emit(this.arquivos); // envia o evento com os arquivos
  }


  lerArquivo(event) {
    const id = event.target.id;
    // https://www.w3.org/TR/FileAPI/#ref-for-dfn-filefileReader-1
    const files = (<HTMLInputElement>document.getElementById(id)).files;
    if (files.length > 0) {
      const file = files[0];
      // this.arquivos.set(id, DataUpload.getData(file)); //mapa
      this.arquivos[id] = DataUpload.getData(file);
      if (Object.keys(this.arquivos).length >= 1) { // verifica se os arquivos de linha e de barra têm sucesso
        this.filesLoaded();
        console.log(this.arquivos);
      }
    }

  }

}
