import { Linha } from './linha';
import { Barra } from './barra';

export class CurtoCircuito {
    static header = ['Corrente de falta'];


    if_m: number;
    if_f: number;


    tensoes: Array<TensaoPosFalta>;
    correntes: Array<CorrenteFalta>;

    toArray() {
        const array = [this.if_m];
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

}

export class CorrenteFalta {

    // identificação
    linha: Linha;

    // correntes de falta
    if_m: number;
    if_f: number;

}


