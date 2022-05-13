import { DadosUsuario } from '../models/dadosUsuario';

export const salvaStorageDadosUsuario = (data:DadosUsuario) => {    
    if (data) {
        localStorage.setItem("dadosUsuario", JSON.stringify(data));     
    }    
}

export const salvaStorageToken = (data:string) => {
    localStorage.setItem('token', data);
}

export const limpaStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('dadosUsuario');
    localStorage.removeItem('loggedIn');    
}

export const salvaStorageLoggedIn = () => {
    localStorage.setItem('loggedIn', 'true');            
}

export const buscaDadosUsuario = () => {
    const strUser = localStorage.getItem("dadosUsuario");
    if (strUser !== null && strUser !== undefined && strUser !== "\"\"") {
        const dadosUsuario:DadosUsuario = JSON.parse(strUser)
        
        return dadosUsuario;
    } else {
        const dadosUsuario:DadosUsuario = {
            idPerfil: 0,
            isLoggedIn: false,
            matriculaUser: "0",
            nomeUser: ""
        }
        return dadosUsuario;
    }    
}

export const isLoggedIn = () => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn === "true") {
        return true;
    } else {
        return false;
    }
}

export const buscaToken = () => {
    const strToken = localStorage.getItem('token');
    
    if (strToken !== null && strToken !== undefined)  {        
        return strToken;
    } else {
        return null;
    }
}

export const codigoProduto = (produto: string) => {
    switch (produto) {
        case "SEGURO DE ACIDENTES PESSOAIS":
            return 0;
        case "SEGURO VIDA SIMPLES":
            return 1;
        case "SEGURO VIDA COMPOSTO":
            return 2;
        case "PARCEIROS":
            return 3;
        default:
            return -1;
    }
}

export const trataMensagemErro = (errors: string[]) => {
    let message = `Ocorreram os seguintes erros:\n`;
    message += errors.join("\n");
    return message.replaceAll(',', '\n');
}