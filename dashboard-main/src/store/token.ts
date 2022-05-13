import { createSlice } from "@reduxjs/toolkit";
import { buscaToken, limpaStorage, salvaStorageToken } from "../helpers/helper";

const initialTokenState = { 
    token: buscaToken()
}

const tokenSlice = createSlice({
    name: 'token',
    initialState: initialTokenState, 
    reducers: {
        setToken(state, actions) {            
            state.token = actions.payload.access_token;            
            salvaStorageToken(actions.payload.access_token);
        },
        logout(state) {
            state.token = '';
            limpaStorage();
        }
    }
});

export const tokenActions = tokenSlice.actions;

export default tokenSlice.reducer;