import { EnumBar } from './enumBar';
import { Gerador } from './gerador';
import { IComponente } from './componente';

export class DiagramaSEP {
    private _nodes: Array<IComponente> = new Array();
    private _dict_nodes: Map<number, IComponente> = new Map();

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
        // this._nodes.push(newComponent);
        this._dict_nodes.set(newComponent.id, newComponent);
        this.count++;
        return newComponent.id;
    }

    update(updateComponent: IComponente) {
        this._dict_nodes[updateComponent.id] = updateComponent;
        // this._nodes[updateComponent.id] = updateComponent;
    }

    getNodes(): Array<IComponente> {
        // return this._nodes;
        return Array.from(this._dict_nodes.values()); // retornar um interable
    }

    getNode(id: number): IComponente {
        return this._dict_nodes.get(id);
    }


}


