import { configureStore } from "@reduxjs/toolkit";
import hashconnectReducer from "./hashconnectSlice";

export const store = configureStore({
    reducer: {
        hashconnect: hashconnectReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
