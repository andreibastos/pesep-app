import { EnumBar } from './enumBar';

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
