export interface LogControleAplicacao {
    id: number;
    idControleAplicacoes: number;
    data?: Date;
    mensagem: string;
    gerouErro?: boolean;
}