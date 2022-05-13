import { createSlice } from "@reduxjs/toolkit";

const initialModalState = { 
    show: false, 
    title: '',     
    messages: <string[]>[],
    extraData: <string[]>[]
}

const modalSlice = createSlice({
    name: 'modal',
    initialState: initialModalState, 
    reducers: {
        show(state, actions) {
            state.show = actions.payload;
        },
        setData(state, actions) {
            state.title = actions.payload.title;
            state.messages = actions.payload.messages; 
            state.extraData = actions.payload.extraData;  
        }
    }
});

export const modalActions = modalSlice.actions;

export default modalSlice.reducer;