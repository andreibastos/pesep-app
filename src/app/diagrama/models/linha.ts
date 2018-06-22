import { Barra } from './barra';

export class Linha {
    id_linha: string;
    R: number;
    X: number;
    TAP: number;
    A: number;
    constructor(public de: Barra, public para: Barra) {
        this.id_linha = `line_${de.id_barra.split('_')[1]}_${para.id_barra.split('_')[1]}`;
    }
}
