import { createSlice } from "@reduxjs/toolkit";

const initialSpinnerState = { 
    show: false
}

const spinnerSlice = createSlice({
    name: 'spinner',
    initialState: initialSpinnerState, 
    reducers: {
        show(state, actions) {
            state.show = actions.payload;
        }
    }
});

export const spinnerlActions = spinnerSlice.actions;

export default spinnerSlice.reducer;