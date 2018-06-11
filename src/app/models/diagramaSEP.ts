import { EnumBar } from './enumBar';
import { Gerador } from './gerador';
import { Carga } from './carga';
import { Fonte } from './fonte';
import { IComponente } from './componente';
import * as d3 from 'd3';
import * as SVG from 'svg.js';
import * as interact from 'interactjs';

export class DiagramaSEP {
    private _nodes: Array<IComponente> = new Array();
    private _links = [];

    private _dict_nodes: Map<number, IComponente> = new Map();
    private _container: d3.Selection<d3.BaseType, {}, HTMLElement, any>;

    private _dict_svg_elements: Map<string, SVG.Element> = new Map();
    count = 0;


    private _count_components = {};

    constructor(div: string, height?: number, width?: number) {
        this._count_components[EnumBar.VT] = 0;
        this._count_components[EnumBar.PQ] = 0;
        this._count_components[EnumBar.Slack] = 0;
        this._container = d3.select(div)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g');
        console.log(this._container);

        const draw = SVG(div).size(width, height);
        const circle = draw.circle(100).move(width / 2, height / 2);
        this._dict_svg_elements.set(circle.id(), circle);
        circle.addClass('component-simple');
        this.initInteract();
    }

    initInteract() {
        const self = this;
        interact('.component-simple')
            .draggable({
                inertia: true, // enable inertial throwing
                autoScroll: true // enable autoScroll
            })
            .on('dragstart', function (event) {
                console.log(event.target, 'dragstart');
                console.log(self._dict_svg_elements);

            })
            .on('dragmove', function (event) {
                // console.log(event.target, 'dragmove');
                self._dict_svg_elements
                    .get(event.target.id)
                    .dx(event.dx)
                    .dy(event.dy);
            })
            .on('dragend', function (event) {
                console.log(event.target, 'dragend');
                console.log(self._dict_svg_elements);

            });
    }


    get count_components() {
        return this._count_components;
    }

    add(name: string) {
        const newComponent: IComponente = this.getNewBus(name);
        this._count_components[newComponent.type]++;
        newComponent.id = this.count;
        newComponent.name += ' ' + this._count_components[newComponent.type];
        this._dict_nodes.set(newComponent.id, newComponent);
        this.count++;

        this._container.append('circle')
            .attr('cx', 50)
            .attr('cy', 50)
            .attr('r', 50)
            .style('fill', '#ff0');

        console.log(this.getNodes());

        return newComponent.id;
    }

    getNewBus(name: string) {
        if (name === 'PV') {
            return new Gerador();
        }
        if (name === 'PQ') {
            return new Carga();
        }
        if (name === 'VT') {
            return new Fonte();
        }
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


