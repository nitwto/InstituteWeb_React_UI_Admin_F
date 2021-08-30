import { createSlice, configureStore } from "@reduxjs/toolkit";
import { getInitialState } from "../util/sliceHelpers";
import { notificationSchema } from "../constants/schemas";

const initialState = getInitialState(notificationSchema);

const notificationSlice = createSlice({
  name: "notificationSlice",
  initialState,
  reducers: {
    setField(state, action) {
      let newState = { ...state };
      newState[action.payload.field] = action.payload.value;
      return newState;
    },
  },
});

const store = configureStore({
  reducer: { notification: notificationSlice.reducer },
});

export const notificationActions = notificationSlice.actions;
export default store;
