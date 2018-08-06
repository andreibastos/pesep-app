import { Barra } from './barra';
import { Linha } from './linha';
import { EnumFaltaLocal, EnumFaltaTipo, EnumBarraTipo } from './enumeradores';
export class Falta {
    private _barra: Barra;
    private _linha: Linha;
    xg = 1;
    x0 = 1;
    porcentagem = 1;
    private _enumFaltaLocal: EnumFaltaLocal = EnumFaltaLocal.Barra;
    enumFaltaTipo: EnumFaltaTipo = EnumFaltaTipo.Trifasica;
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
            array.push(`${this._barra.id} ${this.porcentagem} ${this.enumFaltaTipo} ${this.xg} ${this.x0}`);
        } else {
            // tslint:disable-next-line:max-line-length
            // array.push(`${this.enumFaltaLocal.toString()} ${this.id_componente} 0 0 ${this.porcentagem} ${this.enumFaltaTipo} ${this.xg} ${this.x0}`);
        }
        return array;
    }
}
