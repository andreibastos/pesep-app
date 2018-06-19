import { EnumBar } from '../../models/componente';

export class Barra {
    id_barra: string;
    tipo: EnumBar;
    nome: string;
    tensao_0: number;
    angulo_0: number;
    pGerada: number;
    qGerada: number;
    qMinimo: number;
    qMaximo: number;
    pCarga: number;
    qCarga: number;
    pGeradaMin: number;
    pGeradaMax: number;
    qShunt: number;
    X: number;

    constructor(tipo: EnumBar) {
        this.tipo = tipo;
    }
}
