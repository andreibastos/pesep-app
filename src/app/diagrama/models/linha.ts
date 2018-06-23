import { Barra } from './barra';

export class Linha {
    nome = 'Linha';
    id_linha: string;
    R: number;
    X: number;
    TAP: number;
    A: number;
    constructor(public de: Barra, public para: Barra) {
        const id_de_barra = de.id_barra.split('_')[1];
        const id_para_barra = para.id_barra.split('_')[1];
        this.nome += ` ${id_de_barra},${id_para_barra}`;
        this.id_linha = `linha_${id_de_barra}_${para.id_barra.split('_')[1]}`;
    }
}
