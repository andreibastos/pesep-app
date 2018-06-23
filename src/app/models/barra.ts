export class Barra {
    static cabecalho = ['Item',
        'Tipo',
        'Nome',
        'Tensão Inicial (V)',
        'Ângulo Inicial (θ)',
        'Potência Ativa Gerada (P)',
        'Potência Reativa Gerada (Q)',
        'Potência Reativa Mínima (Q)',
        'Potência Reativa Máxima (Q)',
        'Potência Ativa Carga (P)',
        'Potência Reativa Carga (Q)',
        'Potência Ativa Gerada Mínima (P)',
        'Potência Ativa Gerada Máxima (P)',
        'Potência Reativa Shunt (Q)',
        'Reatância Interna (x)'
    ];


    item: number;
    tipo: number;
    nome: string;
    tensao_0: number;
    angulo0: number;
    pGerada: number;
    qGerada: number;
    qMinimo: number;
    qMaximo: number;
    pCarga: number;
    qCarga: number;
    pGeradamin: number;
    pGeradamax: number;
    qShunt: number;
    x: number;



    // constructor(item, tipo, tensao_0, angulo0, pgerada, qGerada, qMinimo, qMaximo, pCarga, qCarga, pGeradaMin, pGeradaMax, qShunt) {
    //     this.item = item;
    //     this.tipo = tipo;
    //     this.tensao_0 = tensao_0;
    //     this.angulo0 = angulo0;
    //     this.pGerada = pgerada;
    //     this.qGerada = qGerada;
    //     this.qMinimo = qMinimo;
    //     this.qMaximo = qMaximo;
    //     this.pCarga = pCarga;
    //     this.qCarga = qCarga;
    //     this.pGeradamin = pGeradaMin;
    //     this.pGeradamax = pGeradaMax;
    //     this.qShunt = qShunt;
    //     this.nome = `Barra ${this.item}`;
    // }

    constructor() {

    }

    novaBarra(vetor) {
        this.item =  parseFloat(vetor[0]);
        this.tipo =  parseFloat(vetor[1]);
        this.nome =  vetor[2];
        this.tensao_0 =  parseFloat(vetor[3]);
        this.angulo0 =  parseFloat(vetor[4]);
        this.pGerada =  parseFloat(vetor[5]);
        this.qGerada =  parseFloat(vetor[6]);
        this.qMinimo =  parseFloat(vetor[7]);
        this.qMaximo =  parseFloat(vetor[8]);
        this.pCarga =  parseFloat(vetor[9]);
        this.qCarga =  parseFloat(vetor[10]);
        this.pGeradamin =  parseFloat(vetor[11]);
        this.pGeradamax =  parseFloat(vetor[12]);
        this.qShunt =  parseFloat(vetor[13]);
        this.x =  parseFloat(vetor[14]);
    }











}