export interface CadastroProduto {
    codProduto: number;
    codSeguradora: number;
    apolice: number;
    limiteMaximo: number | null;
    produto: string;
    status: string;
    planoSeguradora: number | null;
    codCrm: string;
    grupoFat: string;
    produtoPlacar: string;
    produtoRelatorio: string;
    ordemRelatorio: number | null;
}