// import * as Raphael from 'raphael';
import * as SVG from 'svg.js';

export class SVGIcone {
    constructor() {



    }

    static createBus(ID: string, type: string) {
        const bus = SVG(ID).size(100, 100);
        const group = bus.group();
        if (type === 'PV' || type === 'VT') {
            const circle = bus.circle(50).move(2, 25).fill('#FFF').stroke({ width: 2 }).stroke('#000');
            const line_horizontal = bus.line(52, 50, 95, 50).stroke({ width: 2 }).stroke('#000');
            const line_vertical = bus.line(95, 10, 95, 90).stroke({ width: 5 }).stroke('#000');
            const text = bus.text(type === 'PV' ? '~' : '∞').font({ size: 50, family: 'Times New Roman' }).move(10, 20);
            group.add(circle);
            group.add(line_horizontal);
            group.add(line_vertical);
            group.add(text);
            // group = bus.set([circle, line_horizontal, line_vertical, text]);

        } else if (type === 'PQ') {
            const line_horizontal = bus.line(20, 50, 95, 50).stroke({ width: 2 }).stroke('#000');
            const line_vertical = bus.line(95, 10, 95, 90).stroke({ width: 5 }).stroke('#000');
            const triangule = bus.path('m25,60l10,-25l10,25l-10,0l-10,0z')
                .rotate(-90, 25, 60);
            group.add(line_horizontal);
            group.add(line_vertical);
            group.add(triangule);
        }
        return group;
    }

}
