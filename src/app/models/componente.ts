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
export class Carga implements IComponente {
    st: any;
    type: EnumBar = EnumBar.PQ;
    name = 'Carga';
    text = 'Carga';
    x = 0;
    y = 0;
    angle = 0;

    constructor() { }

}
export class Fonte implements IComponente {
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
export class Gerador implements IComponente {
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
    'VT',
    'Slack',
    'PQ'
}


