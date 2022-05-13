import { createSlice } from "@reduxjs/toolkit";
import { inicioFimSemana, ultimoDiaMes } from "../helpers/date";

const initialReportState= { 
    produto: '', 
    dtIni: '', 
    dtFim: '',
    negados: '',
    semana: {
        inicio: '',
        fim: ''
    },
    semanaNotOnlyDate: {
        inicio: '',
        fim: ''
    }
}

const reportSlice = createSlice({
    name: 'report',
    initialState: initialReportState, 
    reducers: {
        setProduto(state, actions) {
            state.produto = actions.payload;
        },
        setNegados(state, actions) {
            state.negados = actions.payload;
        },
        setDataInicial(state, actions) {
            state.dtIni = actions.payload.concat('-01');
        },
        setDataFinal(state, actions) {
            state.dtFim = ultimoDiaMes(actions.payload);
        },
        setSemana(state, actions) {
            state.semana = inicioFimSemana(actions.payload, true);
            state.semanaNotOnlyDate = inicioFimSemana(actions.payload);
        },        
        clear(state) {
            state = initialReportState;
        }
    }
});

export const reportsActions = reportSlice.actions;

export default reportSlice.reducer;