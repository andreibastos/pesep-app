import { IComponente } from './componente';
import { EnumBar } from './enumBar';

export class Carga implements IComponente {
    st: any;
    type: EnumBar = EnumBar.PQ;
    name = 'Carga';
    text = 'Carga';
    x = 0;
    y = 0;
    angle = 0;

    constructor() {

    }

}
