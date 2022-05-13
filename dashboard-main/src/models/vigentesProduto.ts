export interface VigentesProduto {
    datas?: MesAnoObj[];
}

export interface MesAnoObj {
    mesAno: string;
    dias: DiaObj[];
    pnFimMes: number;
    vendasAprovadasFimMes: number;
    vendasPreenchidasFimMes: number;
}

export interface DiaObj {
    dia: number;
    vigentes: number;
    ticketMedio: number;
    negados: number;
    n1: number;
    n2: number;
    pn: number;
}