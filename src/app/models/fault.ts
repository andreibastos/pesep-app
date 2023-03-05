import { Barra } from './bus';
import { Linha } from './line';
import { EnumFaltaLocal, EnumFaltaTipo, EnumBarraTipo } from './enumerators';
export class Falta {
    private _barra: Barra = null;
    private _linha: Linha = null;
    private _enumFaltaLocal: EnumFaltaLocal = EnumFaltaLocal.Barra;
    xg = 1;
    x0 = 1;
    porcentagem = 1;
    enumFaltaTipo: EnumFaltaTipo = EnumFaltaTipo.Trifasica;


    static fromDict(dict, linha_or_barra: Linha | Barra): Falta {
        const barra = dict['barra'];
        const linha = dict['linha'];
        let falta: Falta;
        falta = new Falta(linha_or_barra);
        falta.enumFaltaTipo = dict['tipo'] || EnumFaltaTipo.Trifasica;
        falta.x0 = dict['x0'];
        falta.xg = dict['xg'];
        return falta;
    }

    constructor(obj: Linha | Barra) {
        this.changeLocal(obj);
    }

    changeLocal(obj) {
        if (obj instanceof Linha) {
            this.linha = obj;
        } else {
            this.barra = obj;
        }
    }

    get enumFaltaLocal(): EnumFaltaLocal {
        return this._enumFaltaLocal;
    }

    get barra(): Barra {
        return this._barra;
    }

    set barra(barra: Barra) {
        this._linha = null;
        this._barra = barra;
        this._enumFaltaLocal = EnumFaltaLocal.Barra;
        this.porcentagem = 1;
    }

    get linha(): Linha {
        return this._linha;
    }

    set linha(linha: Linha) {
        this._barra = null;
        this._linha = linha;
        this._enumFaltaLocal = EnumFaltaLocal.Linha;
        this.porcentagem = 0.5;
    }

    toArray() {
        const array = [];
        if (this._enumFaltaLocal === EnumFaltaLocal.Barra) {
            // tslint:disable-next-line:max-line-length
            array.push(`${this.barra.id} ${this.porcentagem} ${this.enumFaltaTipo} ${this.xg} ${this.x0}`);
        } else {
            // tslint:disable-next-line:max-line-length
            array.push(`${this.linha.para.id} ${this.porcentagem} ${this.enumFaltaTipo} ${this.xg} ${this.x0}`);
        }
        return array;
    }

    toDict() {
        const dict = {};
        if (this.barra) {
            dict['barra_id'] = this.barra.id;
        }
        if (this.linha) {
            dict['linha_id'] = this.linha.id;
        }
        dict['tipo'] = this.enumFaltaTipo;
        dict['porcentagem'] = this.porcentagem;
        dict['xg'] = this.xg;
        dict['x0'] = this.x0;
        return dict;
    }


}
