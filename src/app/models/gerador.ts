import { IComponente } from './componente';
import { EnumBar } from './enumBar';

export class Gerador implements IComponente {
    st: any;
    type: EnumBar = EnumBar.Slack;
    name = 'Gerador';
    text = 'Gerador';
    x = 0;
    y = 0;
    angle = 0;

    constructor() {

    }

}
