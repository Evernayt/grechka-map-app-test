import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPlacemark } from "../../models/IPlacemark";

type MapState = {
  sidebarIsShown: boolean;
  selectedPlacemark: IPlacemark | null;
  placemarks: IPlacemark[];
};

const initialState: MapState = {
  sidebarIsShown: false,
  selectedPlacemark: null,
  placemarks: [],
};

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setSidebarIsShownAction(state, action: PayloadAction<boolean>) {
      state.sidebarIsShown = action.payload;
    },
    selectPlacemarkAction(state, action: PayloadAction<IPlacemark | null>) {
      state.selectedPlacemark = action.payload;
    },
    addPlacemarkAction(state, action: PayloadAction<IPlacemark>) {
      state.placemarks.push(action.payload);
    },
    setPlacemarksAction(state, action: PayloadAction<IPlacemark[]>) {
      state.placemarks = action.payload;
    },
  },
});

export const {
  setSidebarIsShownAction,
  selectPlacemarkAction,
  addPlacemarkAction,
  setPlacemarksAction,
} = mapSlice.actions;

export default mapSlice.reducer;
