export class ExportDownload {

    static export(text, filename, format = 'csv') {
        const a = document.createElement('a');
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        const blob = new Blob([text], { type: `text/${format}` });
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = `${filename}.${format}`; /* your file name*/
        a.click();
        a.remove();
        return 'success';
    }

   static arrayToTxt(array) {
        let str = '';
        array.forEach(row => {
          row.forEach(column => {
            str += column + ',';
          });
          str = str.slice(0, -1);
          str += '\n';
        });
        return str;
      }
}
