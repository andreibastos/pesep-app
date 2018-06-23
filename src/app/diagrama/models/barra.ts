import { EnumBarra } from '../../models/componente';

export class Barra {
    id_barra = 'nova_barra';
    tipo: EnumBarra;
    nome: string;
    tensao_0 = 1.0;
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

    constructor(tipo: EnumBarra) {
        this.tipo = tipo;
        this.id_barra = tipo.toString();
    }
}
