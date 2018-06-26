import { Barra } from './barra';
import { IComponente } from './componente';
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
}
