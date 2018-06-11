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
    private _container: SVG.Doc;

    private _dict_svg_elements: Map<string, SVG.Element> = new Map();
    count = 0;


    private _count_components = {};

    constructor(div: string, height?: number, width?: number) {
        this._count_components[EnumBar.VT] = 0;
        this._count_components[EnumBar.PQ] = 0;
        this._count_components[EnumBar.Slack] = 0;

        this._container = SVG(div)
            .size(width, height);

        this.initInteract();
    }

    initInteract() {
        const self = this;
        interact('.component-simple')
            .draggable({
                inertia: true, // enable inertial throwing
                autoScroll: true, // enable autoScroll
                // keep the element within the area of draw_inside
                restrict: {
                    restriction: document.getElementById(this._container.id()),
                    endOnly: true,
                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
                }
            })
            .on('dragstart', function (event) {
                // console.log(event.target, 'dragstart');
                // console.log(self._dict_svg_elements);

            })
            .on('dragmove', function (event) {
                // console.log(event.target, 'dragmove');
                self._dict_svg_elements
                    .get(event.target.id)
                    .dx(event.dx)
                    .dy(event.dy);
            })
            .on('dragend', function (event) {
                // console.log(event.target, 'dragend');
                // console.log(self._dict_svg_elements);

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
        const node = this.createNode(name)
            .id(newComponent.name)
            .move(this._container.width() / 2, this._container.height() / 2);
        this._dict_svg_elements.set(node.id(), node);
        node.addClass('component-simple');
        console.log(this.getNodes());

        return newComponent.id;
    }

    createNode(name: string): SVG.Element {
        const node = this._container;
        const group = node.group();
        if (name === 'PV' || name === 'VT') {
            const circle = node.circle(50).move(2, 25).fill('#FFF').stroke({ width: 2 }).stroke('#000');
            const line_horizontal = node.line(52, 50, 95, 50).stroke({ width: 2 }).stroke('#000');
            const line_vertical = node.line(95, 10, 95, 90).stroke({ width: 5 }).stroke('#000');
            const text = node.text(name === 'PV' ? '~' : '∞').font({ size: 50, family: 'Times New Roman' }).move(10, 20);
            group.add(circle);
            group.add(line_horizontal);
            group.add(line_vertical);
            group.add(text);

        } else if (name === 'PQ') {
            const line_horizontal = node.line(20, 50, 95, 50).stroke({ width: 2 }).stroke('#000');
            const line_vertical = node.line(95, 10, 95, 90).stroke({ width: 5 }).stroke('#000');
            const triangule = node.path('m25,60l10,-25l10,25l-10,0l-10,0z')
                .rotate(-90, 25, 60);
            group.add(line_horizontal);
            group.add(line_vertical);
            group.add(triangule);
            // group.rotate(180);
            console.log(group);

        }
        return group;

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


