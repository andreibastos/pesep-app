import { IComponente } from './componente';
import { EnumBar } from './enumBar';

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
