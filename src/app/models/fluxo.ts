import { Barra } from './barra';
export class Fluxo {

    static header = ['Da Barra', 'Da Barra', 'Para Barra', 'Para Barra', 'P (pu)', 'Q (pu) '];

    constructor(public de: Barra, public para: Barra, public pFluxo: number, public qFluxo: number) {
    }
    toArray(): any[] {
        const array = [];
        array.push(this.de.id_barra.split('_')[1]);
        array.push(this.de.nome);
        array.push(this.para.id_barra.split('_')[1]);
        array.push(this.para.nome);
        array.push(this.pFluxo);
        array.push(this.qFluxo);
        return array;
    }

    toDeArray(): any[] {
        const array = Array(11);
        array.fill('');
        array[0] = this.de.id;
        array[1] = this.de.nome;
        array[2] = this.de.tensao_0;
        array[3] = this.de.angulo_0;
        array[4] = this.de.pGerada;
        array[5] = this.de.qGerada;
        array[6] = this.de.pCarga;
        array[7] = this.de.qCarga;
        return array;
    }

    toParaArray(): any[] {
        const array = Array(11);
        array.fill('');
        array[8] = this.para.id;
        array[9] = this.pFluxo;
        array[10] = this.qFluxo;
        return array;

    }
}
