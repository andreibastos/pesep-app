import { Conversion } from './conversions';
import { EventEmitter } from '@angular/core';
export class DataUpload {

    dataEmitter = new EventEmitter();

    constructor() {


    }

     getData(filename): Array<any> {
         const self = this;
        const data: Array<any> = new Array();

        let fileReader: FileReader;
        fileReader = new FileReader();
        // Read file into memory as UTF-8
        fileReader.readAsText(filename, 'UTF-8');
        fileReader.onload = function (evt) {
            const data_text = Conversion.TextToList(evt.target['result']);
            data_text.forEach((row, index) => {
                row = Conversion.cleanLinesFile(row, index);
                data.push(row);
            });
            self.dataEmitter.emit(data);
        };
        return data;
    }




}
