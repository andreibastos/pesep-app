import { Componente } from './componente';
import { EnumBar } from './enumBar';

export class Gerador implements Componente {
    st: any;
    type: EnumBar = EnumBar.PQ;
    name = 'gerador';
    text = 'gerador 1';
    id = '1';
    x = 0;
    y = 0;
    angle = 0;



    constructor() {

    }

}
