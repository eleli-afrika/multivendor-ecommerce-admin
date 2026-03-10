import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./slices/AuthSlice";
import { LoaderSlice } from "./slices/Loaderslice";
import CategoryReducer from "./slices/CategoriesSlice";
import { useDispatch } from "react-redux";
import AdsReducer from "./slices/AdsSlice";

const store = configureStore({
    reducer: {
        auth: AuthReducer,
        loaders: LoaderSlice.reducer,
        categories: CategoryReducer,
        AllAds: AdsReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;