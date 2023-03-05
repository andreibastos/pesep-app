import { Barra } from './bus';
import { EnumTransformadorTipo } from './enumerators';

export class Linha {
    static header = ['ID', 'De', 'Para', 'r', 'x', 'Tap', 'Ângulo', 'Reatância do Trafo', 'Reatância Zero', 'Tipo de Trafo'];

    _id_linha: string;

    nome = 'Linha';
    R = 0;
    X = 1;
    TAP = 1;
    A = 0;
    _tipo_trafo = EnumTransformadorTipo['Estrela Estrela'];
    resistencia_zero = 0.5;
    reatancia_trafo = 0;


    static fromDict(dict): Linha {
        const linha: Linha = new Linha();
        linha.id_linha = dict['id'];
        // linha.de = Barra.fromDict(dict['de']);
        // linha.para = Barra.fromDict(dict['para']);
        linha.R = dict['R'];
        linha.X = dict['X'];
        linha.TAP = dict['TAP'];
        linha.A = dict['A'];
        linha.reatancia_trafo = dict['reatancia_trafo'];
        linha.resistencia_zero = dict['resistencia_zero'];
        linha.tipo_trafo = dict['tipo_trafo'];
        return linha;
    }

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

    toArray(percent = 1): any[] {
        const array = [];
        array.push(this.id);
        array.push(this.de.id);
        array.push(this.para.id);
        array.push(this.R * percent);
        array.push(this.X * percent);
        array.push(this.TAP);
        array.push(this.A);
        array.push(this.reatancia_trafo);
        array.push(this.resistencia_zero);
        array.push(this.tipo_trafo);
        return array;
    }

    toDict(): any {
        const dict = {};
        dict['id'] = this.id;
        dict['de'] = this.de.id;
        dict['para'] = this.para.id;
        dict['R'] = this.R;
        dict['X'] = this.X;
        dict['TAP'] = this.TAP;
        dict['A'] = this.A;
        dict['reatancia_trafo'] = this.reatancia_trafo;
        dict['resistencia_zero'] = this.resistencia_zero;
        dict['tipo_trafo'] = this.tipo_trafo;
        return dict;
    }


    arrayToLinha(array: any[]) {
        array.forEach(col => {
            // console.log(col);
        });
    }

    set tipo_trafo(enumTransformadorTipo: EnumTransformadorTipo) {
        this._tipo_trafo = enumTransformadorTipo;
    }

    get tipo_trafo() {
        return this._tipo_trafo;
    }

    getTipoTrafo() {

    }
}

