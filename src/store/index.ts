import { configureStore } from "@reduxjs/toolkit";
import MapSlice from "./reducers/MapSlice";

const store = configureStore({
  reducer: {
    map: MapSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
