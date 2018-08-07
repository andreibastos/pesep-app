import { EnumFaltaLocal } from './enumeradores';
import { Linha } from './linha';
import { Barra } from './barra';
import { MathPowerService, MathPowerMethod } from '../shared/math-power.service';
import { Fluxo } from './fluxo';
import { EventEmitter, Output } from '@angular/core';
import { Falta } from './falta';
import { CurtoCircuito, TensaoPosFalta, CorrenteFalta } from './curto-circuito';
export class Sistema {

    private results;

    fluxos: Array<Fluxo> = new Array();
    curtoCircuito: CurtoCircuito;
    curto;

    falta: Falta = null;

    @Output()
    calculandoFluxo: EventEmitter<Array<Fluxo>> = new EventEmitter();
    calculandoCurto: EventEmitter<CurtoCircuito> = new EventEmitter();

    @Output()
    errorHandler: EventEmitter<string> = new EventEmitter();

    constructor(public linhas: Array<Linha>, public barras: Array<Barra>, private mathPowerService?: MathPowerService) {
    }

    ExcluirFalta() {
        this.falta = null;
    }

    hasFalta() {
        return this.falta !== null;
    }

    getBarraByID(id: number): Barra {
        const id_barra = `barra_${id}`;
        return this.barras.find(function (barra) { return barra.id_barra === id_barra; });
    }

    getLinhaByID(id: number): Linha {
        const id_linha = `linha_${id}`;
        const linha_find = this.linhas.find(function (linha) { return linha.id_linha === id_linha; });
        return linha_find;
    }

    toObjectArray(): any {
        const files = [
            {
                name: 'linhas',
                filename: 'linha.csv'
            },
            {
                name: 'barras',
                filename: 'barra.csv'
            }, {
                name: 'falta',
                filename: 'entrada_falta.txt'
            },
        ];
        const objectArray = {};
        files.forEach((value) => {
            objectArray[value.filename] = this.toTable(value.name, false);
        });
        return objectArray;
    }

    toTable(field: string, withHeader = true): any[] {
        let table = [];
        let header = [];

        if (field === 'fluxos') {
            if (withHeader) {
                header = Fluxo.header;
                table.push(header);
            }
            table = this.fluxosToTable();
        } else if (field === 'linhas') {
            if (withHeader) {
                header = Linha.header;
                table.push(header);
            }
            this[field].forEach(row => {
                if (this.hasFalta()) {
                    table.push(row.toArray(this.falta.porcentagem));
                } else {
                    table.push(row.toArray());
                }
            });

        } else if (field === 'barras') {
            if (withHeader) {
                header = Barra.header;
                table.push(header);
            }
            this[field].forEach(row => {
                table.push(row.toArray());
            });

        } else if (field === 'falta') {
            if (this.falta) {
                table.push(this.falta.toArray());
            }
        } else if (field === 'curto') {
            // array = this.curto;
            if (this.curtoCircuito) {
                table = this.curtoCircuito.toTable();
            }
            console.log(table);
        } else if (field === 'matrizes') {
            table = this.matrizesToTable();
        }

        return table;
    }

    matrizesToTable(): any[] {
        const table = [];
        if (this.curtoCircuito) {
            table.push(['']);
            table.push(['Matriz de Susceptância']);
            table.push(...this.curtoCircuito.matriz_susceptancia);
            table.push(['Matriz de Impedância de Sequência Positiva/Negativa']);
            table.push(...this.curtoCircuito.matriz_impedancia);
            table.push(['Matriz de Sequência Zero']);
            table.push(...this.curtoCircuito.matriz_impedancia_seq_zero);
        }
        return table;
    }

    fluxosToTable() {
        const dataTable = {};
        const tabela = [];
        tabela.push(['ID', 'Nome', 'Tensão', 'Ângulo', 'P Gerada', 'Q Gerada', 'P Carga', 'Q Carga', 'Para', 'P Fluxo', 'Q Fluxo']);
        this.fluxos.forEach(fluxo => {
            if (!dataTable[fluxo.de.id_barra]) {
                dataTable[fluxo.de.id_barra] = [];
                dataTable[fluxo.de.id_barra].push(fluxo.toDeArray());
            }
            dataTable[fluxo.de.id_barra].push(fluxo.toParaArray());
        });
        Object.keys(dataTable).forEach(key => {
            dataTable[key].forEach(array => {
                tabela.push(array);
            });
        });
        return tabela;
    }

    CriarFluxos(fluxoPotencia: any[]) {
        this.fluxos = [];
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
                                const valor = parseFloat(linha[i]) || null;
                                if (valor) {
                                    de_anterior[colunaNome] = valor;

                                } else {
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
        // console.log(this.fluxos);
        this.calculandoFluxo.emit(this.fluxos);
    }

    CriarCurtos(files: any[]) {
        console.log(files);
        const corrente_falta = files['corrente_falta.txt'][0];

        this.curtoCircuito = new CurtoCircuito();
        this.curtoCircuito.local = files['entrada_falta.txt'][0];
        this.curtoCircuito.if_m = [];
        this.curtoCircuito.if_f = [];
        [0, 2, 4].forEach(value => { this.curtoCircuito.if_m.push(corrente_falta[value]); });
        [1, 3, 5].forEach(value => { this.curtoCircuito.if_f.push(corrente_falta[value]); });
        this.curtoCircuito.tensoes = this.voltagesAfterFault(files['tensao_pos_falta.txt']);
        this.curtoCircuito.correntes = this.currentsAfterFault(files['corrente_linha_falta.txt']);
        this.calculandoCurto.emit(this.curtoCircuito);

        this.curtoCircuito.matriz_impedancia = files['matriz_imp.txt'];
        this.curtoCircuito.matriz_impedancia_seq_zero = files['matriz_imp_zero.txt'];
        this.curtoCircuito.matriz_susceptancia = files['matriz_sus.txt'];

        // console.log(this.curtoCircuito);
    }

    voltageAfterFault(rowVoltage: any[]): TensaoPosFalta {
        const voltage = new TensaoPosFalta();
        // const id_barra = rowVoltage[0];
        const id_barra = rowVoltage[0].split(',')[0];  // remover isso quando luiz colocar separação por virgulas
        voltage.barra = this.getBarraByID(id_barra);
        if (rowVoltage.length === 7) { // maior que 6 parâmetros (trifásico módulo e angulo (3*2))
            voltage.va_m = rowVoltage[1];
            voltage.va_f = rowVoltage[2];
            voltage.vb_m = rowVoltage[3];
            voltage.vb_f = rowVoltage[4];
            voltage.vc_m = rowVoltage[5];
            voltage.vc_f = rowVoltage[6];
        }
        return voltage;
    }

    voltagesAfterFault(tableVoltages: any[]): Array<TensaoPosFalta> {
        const voltages: Array<TensaoPosFalta> = new Array();
        tableVoltages.forEach(rowVoltage => {
            voltages.push(this.voltageAfterFault(rowVoltage));
        });
        return voltages;
    }

    currentAfterFault(rowCurrent: any[]): CorrenteFalta {
        const current = new CorrenteFalta();
        current.de = this.getBarraByID(rowCurrent[0]);
        current.para = this.getBarraByID(rowCurrent[1]);
        current.if_m = rowCurrent[2];
        return current;
    }

    currentsAfterFault(tableCurrents: any[]) {

        const currents: Array<CorrenteFalta> = new Array();
        tableCurrents.forEach(rowCurrent => {
            currents.push(this.currentAfterFault(rowCurrent));
        });
        return currents;
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
        const self = this;
        this.mathPowerService.calcule(this.toObjectArray(), MathPowerMethod.FPO).then(
            results => {
                this.results = results;
                const power_flow = results['fluxo.csv'];
                this.CriarFluxos(power_flow);
                // const susceptance = result['susceptance'][0][0].split(' ');
                // const lines = result['lines'][0][0].split(' ');
                // const columns = result['columns'][0][0].split(' ');
                // this.CriarMatrizSusceptancia(susceptance, lines, columns);

            }
        ).catch(
            function (e) {
                self.errorHandler.emit(e);
            }
        );
    }

    CalcularCurto() {
        const self = this;
        this.mathPowerService.calcule(this.toObjectArray(), MathPowerMethod.CC).then(
            results => {
                this.CriarCurtos(results);
            }
        ).catch(
            function (e) {
                self.errorHandler.emit(e);
            }
        );
    }
}
