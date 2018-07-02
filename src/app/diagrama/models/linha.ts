import { IComponente } from './componente';
import { Barra } from './barra';

export class Linha {
    static header = ['ID', 'De', 'Para', 'r', 'x', 'Tap', 'Ângulo', 'Tipo de Trafo', 'Reatância Zero', 'Reatância do Trafo'];

    _id_linha: string;

    nome = 'Linha';
    R = 0;
    X = 1;
    TAP = 1;
    A = 0;
    _tipo_trafo = EnumTransformador['Delta Estrela'];
    resistencia_zero = 0;
    reatancia_trafo = 0;

    constructor(public de?: Barra, public para?: Barra) {
        if (de && para) {
            this.nome += ` ${de.id},${para.id}`;
        }
    }

    set id_linha(id) {
        if (id.indexOf('_') === -1) {
            this._id_linha = `linha_${id}`;
        } else {
            this._id_linha = id;
        }
    }

    get id_linha(): string {
        return this._id_linha;
    }

    get id() {
        return this.id_linha.split('_')[1];
    }

    toArray(): any[] {
        const array = [];
        array.push(this.id);
        array.push(this.de.id);
        array.push(this.para.id);
        array.push(this.R);
        array.push(this.X);
        array.push(this.TAP);
        array.push(this.A);
        array.push(this.tipo_trafo);
        array.push(this.resistencia_zero);
        array.push(this.reatancia_trafo);
        return array;
    }

    set tipo_trafo(enumTransformador: EnumTransformador) {
        this._tipo_trafo = enumTransformador;
    }

    get tipo_trafo() {
        return this._tipo_trafo;
    }

    getTipoTrafo() {

    }
}


export enum EnumTransformador {
    'Delta Estrela' = '1',
    'Estrela Estrela' = '2'
}
