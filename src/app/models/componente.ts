export interface IComponente {

    x: number; // posição x
    y: number; // posição y
    angle: number; // angulo
    name: string; // nome do componente
    text: string; // texto junto com o componente
    id?: number; // identificação
    type: EnumBar; // tipo de componente

    st: any; // set, conjunto;

}
export interface IBarra {
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
    xGenerator: number;
}
export class Carga implements IComponente, IBarra {
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
    xGenerator: number;
    st: any;
    type: EnumBar = EnumBar.PQ;
    name = 'Carga';
    text = 'Carga';
    x = 0;
    y = 0;
    angle = 0;

    constructor() { }

}
export class Fonte implements IComponente, IBarra {
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
    xGenerator: number;
    st: any;
    type: EnumBar = EnumBar.VT;
    name = 'Fonte';
    text = 'Fonte';
    x = 0;
    y = 0;
    angle = 0;

    constructor() {

    }
}
export class Gerador implements IComponente, IBarra {
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
    xGenerator: number;
    st: any;
    type: EnumBar = EnumBar.Slack;
    name = 'Gerador';
    text = 'Gerador';
    x = 0;
    y = 0;
    angle = 0;

    constructor() { }

}

export enum EnumBar {
    VT,
    Slack,
    PQ
}


