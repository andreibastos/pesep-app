import { IComponente } from './componente';
import { Barra } from './barra';

export class Linha {
    static header = ['ID', 'de', 'para', 'r', 'x', 'Tap', 'Ângulo', 'Tipo de Trafo', 'Resistência Zero', 'Reatância do Trafo'];

    id_linha: string;
    nome = 'Linha';
    R = 0;
    X = 1;
    TAP = 1;
    A = 0;
    tipo_trafo = 2;
    resistencia_zero = 0;
    reatancia_trafo = 0;

    constructor(public de?: Barra, public para?: Barra) {
        if (de && para) {
            const id_de_barra = de.id_barra.split('_')[1];
            const id_para_barra = para.id_barra.split('_')[1];
            this.nome += ` ${id_de_barra},${id_para_barra}`;
            this.id_linha = `linha_${id_de_barra}_${para.id_barra.split('_')[1]}`;
        }
    }

    toArray(): any[] {
        const array = [];
        array.push(this.id_linha.split('_')[1]);
        array.push(this.de.id_barra.split('_')[1]);
        array.push(this.para.id_barra.split('_')[1]);
        array.push(this.R);
        array.push(this.X);
        array.push(this.TAP);
        array.push(this.A);
        array.push(this.tipo_trafo);
        array.push(this.resistencia_zero);
        array.push(this.reatancia_trafo);
        return array;
    }
}
