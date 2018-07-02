import { EnumFaltaLocal, EnumFaltaTipo } from './enumeradores';
export class Falta {
    id_componente: number;

    xg: number;
    x0: number;
    xf: number;
    porcentagem: number;

    enumFaltaLocal: EnumFaltaLocal;
    enumFaltaTipo: EnumFaltaTipo;
}
