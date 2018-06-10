import { Conversion } from './conversions';
export class DataUpload {


    constructor() {


    }

    static getData(filename): Array<any> {
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
        };
        return data;
    }




}
