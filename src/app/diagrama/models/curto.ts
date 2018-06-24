import { Barra } from './barra';
import { Linha } from './linha';
import { EnumCurtoTipo } from '../../models/componente';

export class Curto {
    tipo: EnumCurtoTipo;
    linha: Linha;
    barra: Barra;
    constructor(tipo?: EnumCurtoTipo) {
        this.tipo = tipo;
    }
}


