import { DataUpload } from '../../shared/utils/data-upload';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-upload-csv',
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.css']
})
export class UploadCsvComponent implements OnInit {

  @Input() label = 'label';
  @Input() placeholder = 'placeholder';
  @Input() filename = 'filename';

  fileCSV = [];
  dataUpload = new DataUpload();


  // evento emissor. emite arquivoLinha e o arquivoBarra
  @Output() filesLoadedEmit = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  ReadFile(event) {
    const id = event.target.id;
    // https://www.w3.org/TR/FileAPI/#ref-for-dfn-filefileReader-1
    const files = (<HTMLInputElement>document.getElementById(id)).files;
    if (files.length > 0) {
      const file = files[0];
      this.dataUpload.getData(file);
      this.dataUpload.dataEmitter.subscribe(data => { this.ReceiveUpload(data); });
    }
  }

  ReceiveUpload(data) {
    this.fileCSV = data || [];
    if (Object.keys(this.fileCSV).length >= 1) {
      this.SendFile();
    }
  }

  SendFile() {
    const data = {
      name: this.filename,
      data: this.fileCSV
    };
    this.filesLoadedEmit.emit(data);
  }
}
