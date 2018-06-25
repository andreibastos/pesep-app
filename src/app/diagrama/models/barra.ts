import { EnumTipoBarra } from '../../models/componente';

export class Barra {
    id_barra = 'nova_barra';
    tipo: EnumTipoBarra;
    nome = '';
    tensao_0 = 1.0;
    angulo_0 = 0.0;
    pGerada = 0;
    qGerada = 0;
    pCarga = 0;
    qCarga = 0;
    pGeradaMin = 0;
    pGeradaMax = 0;
    qGeradaMin = 0;
    qGeradaMax = 0;
    qShunt = 0;
    X = 0;

    constructor(tipo: EnumTipoBarra) {
        this.tipo = tipo;
        this.id_barra = tipo.toString();
        if (tipo === EnumTipoBarra.PQ) {
            this.pCarga = 1;
        }

    }

}
