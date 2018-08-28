import { EnumBarraTipo } from '../models/enumeradores';

export class Barra {

    static header = ['Item',
        'Tipo',
        'Nome',
        'Tensão (pu)',
        'Ângulo (θ)',
        'Potência Ativa Gerada (pu)',
        'Potência Reativa Gerada (pu)',
        'Potência Reativa Mínima (pu)',
        'Potência Reativa Máxima (pu)',
        'Potência Ativa Carga (pu)',
        'Potência Reativa Carga (pu)',
        'Potência Ativa Gerada Mínima (pu)',
        'Potência Ativa Gerada Máxima (pu)',
        'Potência Reativa Shunt (pu)',
        'Susceptância Gerador (b)'
    ];

    _id_barra = 'nova_barra';
    tipo: EnumBarraTipo;
    nome = '';
    tensao_0 = 1.0;
    angulo_0 = 0.0;
    pGerada = 0;
    qGerada = 0;
    pCarga = 0;
    qCarga = 0;
    pGeradaMin = 0;
    pGeradaMax = 10;
    qGeradaMin = 0;
    qGeradaMax = 10;
    qShunt = 0;
    X = 1;

    static fromDict(dict): Barra {
        const tipo: EnumBarraTipo = this.fromTipoNumerico(dict['tipo']);
        const barra: Barra = new Barra(tipo);
        barra.id_barra = dict['id'];
        barra.nome = dict['nome'];
        barra.tensao_0 = dict['tensao_0'];
        barra.angulo_0 = dict['angulo_0'];
        barra.pGerada = dict['pGerada'];
        barra.qGerada = dict['qGerada'];
        barra.qGeradaMin = dict['qGeradaMin'];
        barra.qGeradaMax = dict['qGeradaMax'];
        barra.pCarga = dict['pCarga'];
        barra.qCarga = dict['qCarga'];
        barra.pGerada = dict['pGerada'];
        barra.pGerada = dict['pGerada'];
        barra.pGeradaMin = dict['pGeradaMin'];
        barra.pGeradaMax = dict['pGeradaMax'];
        barra.qShunt = dict['qShunt'];
        barra.X = dict['X'];
        return barra;
    }

    static fromTipoNumerico(tipo): EnumBarraTipo {
        if (tipo === 0) {
            return EnumBarraTipo.PQ;
        } else if (tipo === 2) {
            return EnumBarraTipo.PV;
        } else if (tipo === 3) {
            return EnumBarraTipo.Slack;
        }
    }

    constructor(tipo: EnumBarraTipo) {

        if (!tipo) {
            this.tipo = EnumBarraTipo.PQ;
        } else {
            this.tipo = tipo;
            if (tipo === EnumBarraTipo.PQ) {
                this.pCarga = 1;
            } else if (tipo === EnumBarraTipo.Slack) {
                this.pGeradaMax = 10;
                this.qGeradaMax = 10;

            }
        }
        this.id_barra = tipo.toString();
    }

    private tipoNumerico(): Number {
        let numero = 0;
        if (this.tipo === EnumBarraTipo.Slack) {
            numero = 3;
        } else if (this.tipo === EnumBarraTipo.PV) {
            numero = 2;
        }
        return numero;
    }


    isEmpty() {
        return (this.pCarga === 0 && this.qCarga === 0);
    }

    hasQshunt() {
        return this.qShunt !== 0;
    }

    toArray(): any[] {
        const array = [];
        array.push(this.id);
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
        if (this.tipo === EnumBarraTipo.PV) {
            array.push(this.pGerada);
            array.push(this.pGerada);
        } else {
            array.push(this.pGeradaMin);
            array.push(this.pGeradaMax);
        }
        array.push(this.qShunt);
        array.push(this.X);
        return array;
    }

    toDict(): any {
        const dict = {};
        dict['id'] = this.id;
        dict['tipo'] = this.tipoNumerico();
        dict['nome'] = this.nome;
        dict['tensao_0'] = this.tensao_0;
        dict['angulo_0'] = this.angulo_0;
        dict['pGerada'] = this.pGerada;
        dict['qGerada'] = this.qGerada;
        dict['qGeradaMin'] = this.qGeradaMin;
        dict['qGeradaMax'] = this.qGeradaMax;
        dict['pCarga'] = this.pCarga;
        dict['qCarga'] = this.qCarga;
        dict['pGerada'] = this.pGerada;
        dict['pGerada'] = this.pGerada;
        dict['pGeradaMin'] = this.pGeradaMin;
        dict['pGeradaMax'] = this.pGeradaMax;
        dict['qShunt'] = this.qShunt;
        dict['X'] = this.X;
        return dict;
    }

    arrayToBarra(array: any[]) {
        array.forEach(col => {
            // console.log(col);
        });
    }

    set id_barra(id) {
        if (id.indexOf('_') === -1) {
            this._id_barra = `barra_${id}`;
        } else {
            this._id_barra = id;
        }
    }

    get id_barra(): string {
        return this._id_barra;
    }

    get id(): string {
        return this.id_barra.split('_')[1];
    }
}
