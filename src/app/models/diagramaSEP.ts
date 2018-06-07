import { EnumBar } from './enumBar';
import { Gerador } from './gerador';
import { IComponente } from './componente';

export class DiagramaSEP {
    private _nodes: Array<IComponente> = new Array();
    links = [];
    count = 0;

    private _count_components = {};

    constructor() {
        this._count_components[EnumBar.VT] = 0;
        this._count_components[EnumBar.PQ] = 0;
        this._count_components[EnumBar.Slack] = 0;
    }

    get count_components() {
        return this._count_components;
    }

    add(newComponent: IComponente) {

        this._count_components[newComponent.type]++;
        newComponent.id = this.count;
        newComponent.name += ' ' + this._count_components[newComponent.type];
        this._nodes.push(newComponent);
        this.count++;


    }

    getNodes(): Array<IComponente> {
        return this._nodes;
    }


}


