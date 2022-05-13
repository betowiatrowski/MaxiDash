export interface PremioMedioSemanal {
    produto:string;
    semana:string;
    premioSemanal:PremioDia[];
}

export interface PremioDia {
    dia:string;
    premio:number;
}