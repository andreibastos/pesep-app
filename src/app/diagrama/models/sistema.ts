import { Linha } from './linha';
import { Barra } from './barra';
import { MathPowerService } from './../../testes-rapidos/testes-rapidos.service';
export class Sistema {



    constructor(private linhas: Array<Linha>, private barras: Array<Barra>, private mathPowerService: MathPowerService) {
        console.log(this.linhas);
        console.log(this.barras);
    }

    CalcularFluxo() {
        this.mathPowerService.calcular([], 'power_flow').then(
            result => {
                console.log(result);
            }
        ).catch(
            function (e) {
               alert('Não foi possivel encontrar o servidor de cálculos matemáticos.');
            }
        );
    }
}
