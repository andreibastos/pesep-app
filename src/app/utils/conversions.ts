export class Conversion {
    // Converte o texto separado por quebras de linha (\n) por um array [["item1", "item2", ...]]
    static TextToList(text, delimiter = 'auto', size_column?) {
        // text: Texto a ser quebrado em array.
        // delimiter: delimitador de csv (para quebrar as colunas)
        // size_column: indica o número de colunas que deve ter cada linha.

        const data = []; // dados a serem enviados para quem chama essa função
        const lines = text.split('\n') as any[]; // quebra o texto em linhas
        if (delimiter === 'auto') {
            const index_last = lines.length - 1;
            delimiter = lines[index_last].split(',').length >= lines[index_last].split(' ').length ? ',' : ' ';
        }
        lines.forEach(linha => { // para cada linha em linhas
            const colunas = linha.split(delimiter); // quebra de acordo com o delimitador
            if (size_column) {
                if (colunas.length === size_column) { // verifica o tamanho das colunas
                    data.push(colunas); // adiciona na lista de dados;
                }
            } else {
                if (colunas.length > 0) {
                    data.push(colunas); // adiciona na lista de dados;
                }
            }
        });
        return data; // retorna os dados para quem o chama
    }

    static cleanLinesFile(data, index) {
        for (let i = 0; i < data.length; i++) {
            data[i] = data[i].replace('\n', '').replace('\r', '');
            if (data[i] === '' || data[i] === null) {
                data.splice(i, 1);
            }
            if (index > 1) {
                const temp_data = parseFloat(data[i]);
                if (!isNaN(temp_data)) {
                    data[i] = temp_data;
                }
            }
        }
        return data;
    }

}
