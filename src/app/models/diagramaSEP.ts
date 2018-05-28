import { Componente } from './componente';
import { Gerador } from './gerador';

export class DiagramaSEP {
    nodes: Array<Componente> = new Array();
    links = [];

    constructor() {
        const gerador1 = new Gerador();
        gerador1.x = 10;
        gerador1.y = 50;
        const gerador2 = new Gerador();
        gerador1.x = 50;
        gerador1.y = 80;
        this.nodes.push(gerador1);
        this.nodes.push(gerador2);
    }







}
