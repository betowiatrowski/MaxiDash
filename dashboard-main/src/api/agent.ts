import axios, { AxiosResponse } from "axios";
import { buscaToken } from "../helpers/helper";
import { CadastroProduto } from "../models/cadastroProduto";
import { ControleAplicacao } from "../models/controleAplicacao";
import { ControleAplicacoesAgendamento } from "../models/controleAplicacoesAgendamento";
import { DadosUsuario } from "../models/dadosUsuario";
import { IndicePerdaModel } from "../models/indicePerda";
import { LogControleAplicacao } from "../models/logControleAplicacao";
import { LoginData } from "../models/login";
import { QtdErrosAplicacao } from "../models/qtdErrosAplicacao";
import { Token } from "../models/token";
import { VigentesProduto } from "../models/vigentesProduto";

axios.defaults.headers.common["Authorization"] = `Bearer ${buscaToken()}`;
axios.defaults.headers.common["Content-Type"] = 'application/json';
// axios.defaults.baseURL = "";
axios.defaults.baseURL = "";

axios.interceptors.response.use((response) => {
    return response;
}, (error) => {
    return Promise.reject(error.response)    
});

axios.interceptors.request.use(request => {

    if (request.url !== '/token') {
        request.headers = {
            'Authorization': `Bearer ${buscaToken()}`
        }; 
    }
    return request;
});

const responseBody = <T> (response: AxiosResponse<T>) => response;

const requests = {
    get: <T> (url: string, config: {} | undefined) => axios.get<T>(url, config).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete: <T> (url: string) => axios.delete<T>(url).then(responseBody)
}

const CadastroUsuarios = {
    details: (matricula: string) => requests.get<DadosUsuario>(`/CadastroUsuarios/${matricula}`, {})
}

const CadastroProdutos = {
    list: () => requests.get<CadastroProduto[]>('/CadastroProdutos', {}),
    listTipos: () => requests.get<string[]>('/CadastroProdutos/dash', {})
}

const Numeros = {
    listByDate: (dataIni: string, dataFim: string, produto: number) => 
                requests.get<VigentesProduto>(`/numeros/agrupados`, 
                { 
                    params: { dataIni: dataIni, dataFim: dataFim, produto: produto } 
                }),
    indicePerda: (dataIni: string, dataFim: string, produto: number) => 
                  requests.get<IndicePerdaModel[]>(`/numeros/perda`, 
                  { 
                      params: { dataIni: dataIni, dataFim: dataFim, produto: produto } 
                  })
}

const ControleAplicacoes = {
    list: () => requests.get<ControleAplicacao[]>('/ControleAplicacoes', {}),
    details: (id: string) => requests.get<ControleAplicacao>(`/ControleAplicacoes/${id}`, {}),
    update: (id: string, aplicacao: ControleAplicacao) => requests.put<ControleAplicacao>(`/ControleAplicacoes/${id}`, aplicacao),
    verificado: (aplicacao: ControleAplicacao, id: number) => requests.put<ControleAplicacao>(`/ControleAplicacoes/${id}`, aplicacao),
    create: (aplicacao: ControleAplicacao) => requests.post<ControleAplicacao>('/ControleAplicacoes', aplicacao),
    tipos: () => requests.get<string[]>('/ControleAplicacoes/Tipos', {})
}

const ControleAplicacoesAgendamentos = {
    getAll: (id: string) => requests.get<ControleAplicacoesAgendamento[]>(`/ControleAplicacoesAgendamentos/${id}`, {}),
    delete: (id: string) => requests.delete(`/ControleAplicacoesAgendamentos/${id}`),
    create: (agendamento: ControleAplicacoesAgendamento) => requests.post<ControleAplicacoesAgendamento>('/ControleAplicacoesAgendamentos', agendamento)
}

const LogControleAplicacoes = {
    list: (id: number) => requests.get<LogControleAplicacao[]>(`/logs/${id}`, {}),
    lastErrors: (id: number) => requests.get<LogControleAplicacao[]>(`/logs/erros/${id}`, {}),
    details: (id: string) => requests.get<LogControleAplicacao>(`/LogControleAplicacoes/${id}`, {}),
    lastError: (id: string) => requests.get<string>(`/logs/ultimoErro/${id}`, {}),
    qtdByDate: (dataIni: string, dataFim: string) => 
                    requests.get<QtdErrosAplicacao[]>(`/logs/erros/qtd`, 
                    { 
                        params: { dataIni: dataIni, dataFim: dataFim } 
                    })
}

const Login = {
    login: (login:LoginData) => requests.post<Token>('/token', {
        matriculaUser: login.matriculaUser,
        senha: login.senha.toUpperCase()
    })
}

const agent = {
    CadastroProdutos,
    ControleAplicacoes,
    ControleAplicacoesAgendamentos,
    CadastroUsuarios,
    LogControleAplicacoes,
    Login,
    Numeros,
    axios
}

export default agent;