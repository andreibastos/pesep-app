import { EnumBar } from '../../models/componente';

export class Barra {
    id_barra: string;
    tipo: EnumBar;
    nome: string;
    tensao_0 =  1.0;
    angulo_0 = 0.0;
    pGerada: number;
    qGerada: number;
    qMinimo: number;
    qMaximo: number;
    pCarga = 1;
    qCarga = 0;
    pGeradaMin: number;
    pGeradaMax: number;
    qShunt: number;
    X: number;

    constructor(tipo: EnumBar) {
        this.tipo = tipo;
    }
}
