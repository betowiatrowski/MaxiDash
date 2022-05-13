import { createSlice } from "@reduxjs/toolkit";

const initialNotificationState= { 
    show: false, 
    counter: 0, 
    content: <string[]>[]    
}

const notificationSlice = createSlice({
    name: 'notification',
    initialState: initialNotificationState, 
    reducers: {
        show(state) {
            state.show = !state.show;
        },
        counter(state, actions) {
            state.counter = actions.payload;
        },
        setItems(state, actions) {
            state.content = actions.payload;
        }
    }
});

export const notificationActions = notificationSlice.actions;

export default notificationSlice.reducer;