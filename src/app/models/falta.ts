import { Barra } from './barra';
import { EnumFaltaLocal, EnumFaltaTipo } from './enumeradores';
export class Falta {
    id_componente = '';

    montante: Barra;
    jusante: Barra;

    xg = 1;
    x0 = 1;
    xf = 1;
    porcentagem = 0;

    enumFaltaLocal: EnumFaltaLocal = EnumFaltaLocal.Barra;
    enumFaltaTipo: EnumFaltaTipo = EnumFaltaTipo.Trifasica;
    toArray() {
        const array = [];
        if (this.enumFaltaLocal === EnumFaltaLocal.Barra) {
            // tslint:disable-next-line:max-line-length
            array.push(`${this.enumFaltaLocal.toString()} ${this.id_componente} 0 0 ${this.porcentagem} ${this.enumFaltaTipo} ${this.xg} ${this.x0}`);
        }
        return array;
    }

}
