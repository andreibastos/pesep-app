export class Barra {
    item: number;
    tipo: number;
    nome = `Barra ${this.item}`;
    tensao_0: number;
    angulo0: number;
    pGerada: number;
    qGerada: number;
    qMinimo: number;
    qMaximo: number;
    pCarga: number;
    qCarga: number;
    pGeradamin: number;
    pGeradamax: number;
    qShunt: number;

    static cabecalho = ['Item',
    'Tipo',
    'Nome',
    'Tensão Inicial (V)',
    'Ângulo Inicial (θ)',
    'Potência Ativa Gerada (P)',
    'Potência Reativa Gerada (Q)',
    'Potência Reativa Mínima (Q)',
    'Potência Reativa Máxima (Q)',
    'Potência Ativa Carga (P)',
    'Potência Reativa Carga (Q)',
    'Potência Ativa Gerada Mínima (P)',
    'Potência Ativa Gerada Máxima (P)',
    'Potência Reativa Shunt (Q)'];



}
