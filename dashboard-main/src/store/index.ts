import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './modal';
import notificationReducer from './notification';
import tokenReducer from './token';
import usuarioReducer from './usuario';
import spinnerReducer from './spinner';
import reportsActions from './report';

const store = configureStore({
    reducer: { 
        modal: modalReducer, 
        notification: notificationReducer,
        token: tokenReducer,
        usuario: usuarioReducer,
        spinner: spinnerReducer,
        report: reportsActions
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;