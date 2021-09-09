import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialState = {
    id: "",
    token: ""
}

const authSlice = createSlice({
  name: "authSlice",
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
  reducer: { auth: authSlice.reducer },
});

export const notificationActions = authSlice.actions;
export default store;
