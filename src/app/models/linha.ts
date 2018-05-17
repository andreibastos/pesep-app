export class Linha {
    static cabecalho = ['Item', 'Da Barra', 'Para Barra', 'r', 'x', 'Tap', 'A'];

    item: number;
    fBus: number;
    tBus: number;
    r: number;
    x: number;
    tap: number;
    a: number;

    constructor(item, fbus, tbus, r, x, tap, a) {
        this.item = item;
        this.fBus = fbus;
        this.tBus = tbus;
        this.r = r;
        this.x = x;
        this.tap = tap;
        this.a = a;
    }
}
