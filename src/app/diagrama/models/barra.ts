import { EnumTipoBarra } from '../../models/componente';

export class Barra {
    id_barra = 'nova_barra';
    tipo: EnumTipoBarra;
    nome: string;
    tensao_0 = 1.0;
    angulo_0 = 0.0;
    pGerada: number;
    qGerada: number;
    pCarga = 1;
    qCarga = 0;
    pGeradaMin: number;
    pGeradaMax: number;
    qGeradaMin: number;
    qGeradaMax: number;
    qShunt: number;
    X: number;

    constructor(tipo: EnumTipoBarra) {
        this.tipo = tipo;
        this.id_barra = tipo.toString();
        this.nome = this.tipo.toString();
    }
}
