import { Linha } from './linha';
import { Barra } from './barra';
import { MathPowerService } from './../../testes-rapidos/testes-rapidos.service';
import { Fluxo } from './fluxo';
import { EventEmitter, Output } from '@angular/core';
export class Sistema {

    fluxos: Array<Fluxo> = new Array();

    @Output()
    calculandoFluxo: EventEmitter<Array<Fluxo>> = new EventEmitter();

    constructor(public linhas: Array<Linha>, public barras: Array<Barra>, private mathPowerService?: MathPowerService) {

    }

    toObjectArray(): any {
        const objectArray = {};
        ['linhas', 'barras'].forEach((key) => {
            objectArray[key] = this.toTable(key, false);
        });
        return objectArray;
    }

    toTable(field: string, withHeader = true): any[] {
        const array = [];
        if (withHeader) {
            let header = [];
            if (field === 'linhas') {
                header = Linha.header;
            } else if (field === 'fluxos') {
                header = Fluxo.header;
            } else if (field === 'barras') {
                header = Barra.header;
            }
            array.push(header);
        }
        this[field].forEach(row => {
            array.push(row.toArray());
        });
        return array;
    }

    CriarFluxos(fluxoPotencia) {
        let header = [];
        let de_anterior, de_atual, para_atual = null;
        fluxoPotencia.forEach((linha, index) => {
            if (index === 0) {
                header = linha;
            } else {
                const id_de_barra = `barra_${linha[header.indexOf('id_barra')]}`;
                if (id_de_barra) {
                    de_atual = this.barras.find(function (barra) { return barra.id_barra === id_de_barra; });
                    if (de_atual) {
                        de_anterior = de_atual;
                        header.forEach((colunaNome, i) => {
                            if (i > 0 && i < 8) {
                                const valor = parseFloat(linha[i]);
                                if (valor === NaN) {
                                    de_anterior[colunaNome] = linha[i];
                                }
                            }
                        });
                        // console.log('de', de_anterior);
                    } else {
                        de_atual = null;
                        const id_para_barra = `barra_${linha[header.indexOf('para')]}`;
                        para_atual = this.barras.find(function (barra) { return barra.id_barra === id_para_barra; });
                        // console.log('para', para_atual);
                        const pFluxo = linha[header.indexOf('pFluxo')];
                        const qFluxo = linha[header.indexOf('qFluxo')];
                        this.fluxos.push(new Fluxo(de_anterior, para_atual, pFluxo, qFluxo));
                    }
                }
            }
        });
        this.calculandoFluxo.emit(this.fluxos);
    }

    CriarMatrizSusceptancia(susceptancias: any[], linhas: any[], colunas: any[]) {
        const matriz = new Array(linhas.length);
        susceptancias.forEach((susceptancia, index) => {
            const coluna = parseInt(colunas[index], 10) - 1;
            const linha = parseInt(linhas[index], 10) - 1;
            if (!matriz[linha]) {
                matriz[linha] = [];
            }
            matriz[linha][coluna] = parseFloat(susceptancia);
        });
    }

    CalcularFluxo() {
        this.mathPowerService.calcule(this.toObjectArray(), 'power_flow').then(
            result => {
                const power_flow = result['power_flow'];
                this.CriarFluxos(power_flow);
                // const susceptance = result['susceptance'][0][0].split(' ');
                // const lines = result['lines'][0][0].split(' ');
                // const columns = result['columns'][0][0].split(' ');
                // this.CriarMatrizSusceptancia(susceptance, lines, columns);

            }
        ).catch(
            function (e) {
                console.log(e);
            }
        );
    }
}
