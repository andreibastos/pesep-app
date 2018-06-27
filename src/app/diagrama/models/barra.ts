import { EnumTipoBarra } from '../../models/componente';

export class Barra {

    static header = ['Item',
        'Tipo',
        'Nome',
        'Tensão Inicial (pu)',
        'Ângulo Inicial (θ)',
        'Potência Ativa Gerada (pu)',
        'Potência Reativa Gerada (pu)',
        'Potência Reativa Mínima (pu)',
        'Potência Reativa Máxima (pu)',
        'Potência Ativa Carga (pu)',
        'Potência Reativa Carga (pu)',
        'Potência Ativa Gerada Mínima (pu)',
        'Potência Ativa Gerada Máxima (pu)',
        'Potência Reativa Shunt (pu)',
        'Reatância Interna (x)'
    ];

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

    private tipoNumerico(): Number {
        let numero = 3;
        if (this.tipo === EnumTipoBarra.PQ) {
            numero = 2;
        } else if (this.tipo === EnumTipoBarra.PV) {
            numero = 1;
        }
        return numero;
    }
    toArray(): any[] {
        const array = [];
        array.push(this.id_barra.split('_')[1]);
        array.push(this.tipoNumerico());
        array.push(this.nome || this.id_barra);
        array.push(this.tensao_0);
        array.push(this.angulo_0);
        array.push(this.pGerada);
        array.push(this.qGerada);
        array.push(this.qGeradaMin);
        array.push(this.qGeradaMax);
        array.push(this.pCarga);
        array.push(this.qCarga);
        array.push(this.pGeradaMin);
        array.push(this.pGeradaMax);
        array.push(this.qShunt);
        array.push(this.X);
        return array;
    }

    get id(): string {
        return this.id_barra.split('_')[1];
    }
}
