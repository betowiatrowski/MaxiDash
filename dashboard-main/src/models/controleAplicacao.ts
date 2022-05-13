export interface ControleAplicacao {
    id?: string;
    nome: string;
    ultimaExecucao?: string;
    tipo?: string;
    ultimoErro?: string;
    ultimoErroVerificado: boolean;
    descricao?: string;
    habilitado: boolean;
}