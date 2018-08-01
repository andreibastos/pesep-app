import { Linha } from './linha';
import { Barra } from './barra';

export class CurtoCircuito {
    static header = ['Corrente de falta'];


    if_m: any[];
    if_f: any[];
    _local: any;


    tensoes: Array<TensaoPosFalta>;
    correntes: Array<CorrenteFalta>;

    toArray() {
        const array = [this.if_m];
        return array;
    }

    get local() {
        return this._local;
    }

    set local(entrada_falta) {
        const tipo = entrada_falta[0] === '1' ? 'barra' : 'linha';
        const id = entrada_falta[1];
        this._local = `na ${tipo} ${id}`;
    }

    toTable(): any[] {
        const table = Array();
        table.push(['']);
        table.push(['Corrente de Falta']);
        table.push(['Local', 'Corrente A', 'Corrente B', 'Corrente C']);
        table.push(this.getCurrentsFault());
        table.push(['', '', '', '']);
        table.push([' Tensão Pós Falta']);
        table.push(...this.getVoltagesBusAfterFault());
        table.push(['', '', '', '']);
        table.push([' Correntes Pós Falta']);
        table.push(...this.getCurrentsLinesAfterFault());
        return table;
    }

    getCurrentsFault(): any[] {
        const array = [];
        array.push(this.local);
        this.if_m.forEach(
            (current, index) => {
                array.push(`${this.if_m[index]}∠${this.if_f[index]}`);
            }
        );
        return array;
    }

    getVoltagesBusAfterFault(): any[] {
        const array = [];
        array.push(['Barra', 'Tensão A', 'Tensão B', 'Tensão C']);
        this.tensoes.forEach((tensao, index) => {
            array.push(tensao.toArray());
        });
        return array;
    }
    getCurrentsLinesAfterFault(): any[] {
        const array = [];
        array.push(['da Barra', 'para Barra', 'Corrente']);
        this.correntes.forEach((corrente, index) => {
            array.push(corrente.toArray());
        });
        return array;
    }
}
export class TensaoPosFalta {

    // identificação da barra
    barra: Barra;

    // tensões de cada fase
    va_m: number;
    va_f: number;

    vb_m: number;
    vb_f: number;

    vc_m: number;
    vc_f: number;

    // tensão de neutro
    vn_m: number;
    vn_f: number;

    toArray(): any[] {
        const array = [];
        array.push(this.barra.id);
        array.push(`${this.va_m}∠${this.va_f}`);
        array.push(`${this.vb_m}∠${this.vb_f}`);
        array.push(`${this.vc_m}∠${this.vc_f}`);
        return array;
    }
}

export class CorrenteFalta {

    // identificação
    de: Barra;
    para: Barra;

    // correntes de falta
    if_m: number;
    if_f = 0;

    toArray(): any[] {
        const array = [];
        array.push(this.de.id);
        array.push(this.para.id);
        array.push(`${this.if_m}∠${this.if_f}`);
        return array;
    }

}


