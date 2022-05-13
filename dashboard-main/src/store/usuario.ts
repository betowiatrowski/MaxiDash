import { createSlice } from "@reduxjs/toolkit";
import { buscaDadosUsuario, isLoggedIn, limpaStorage, salvaStorageDadosUsuario } from "../helpers/helper";
import { DadosUsuario } from "../models/dadosUsuario";


const dadosUsuario:DadosUsuario = buscaDadosUsuario();

const initialUsuarioState = { 
    nome: dadosUsuario.nomeUser, 
    idPerfil: dadosUsuario.idPerfil,
    matriculaUser: dadosUsuario.matriculaUser,
    isLoggedIn: isLoggedIn(),
}

const usuarioSlice = createSlice({
    name: 'usuario',
    initialState: initialUsuarioState,     
    reducers: {
        setUsuario(state, actions) {
            if (actions.payload !== undefined) {
                state.nome = actions.payload.nomeUser;
                state.idPerfil = actions.payload.idPerfil;
                state.matriculaUser = actions.payload.matriculaUser;
                salvaStorageDadosUsuario(actions.payload);
                localStorage.setItem('loggedIn', 'true');
            }            
        },
        logout(state) {
            state.isLoggedIn = false;            
            state.nome = '';
            state.idPerfil = 0;
            state.matriculaUser = '0';

            limpaStorage();
        }
    }
});

export const usuarioActions = usuarioSlice.actions;

export default usuarioSlice.reducer;