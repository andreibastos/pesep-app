export class Linha {
    static cabecalho = ['Item', 'Da Barra', 'Para Barra', 'r', 'x', 'Tap', 'A'];

    item: number;
    fBus: number;
    tBus: number;
    r: number;
    x: number;
    tap: number;
    a: number;

    // constructor(item, fbus, tbus, r, x, tap, a) {
    //     this.item = item;
    //     this.fBus = fbus;
    //     this.tBus = tbus;
    //     this.r = r;
    //     this.x = x;
    //     this.tap = tap;
    //     this.a = a;
    // }
    constructor() {

    }

    novaLinha(vetor) {
        this.item = vetor[0];
        this.fBus = vetor[1];
        this.tBus = vetor[2];
        this.r = vetor[3];
        this.x = vetor[4];
        this.tap = vetor[5];
        this.a = vetor[6];
    }
}
