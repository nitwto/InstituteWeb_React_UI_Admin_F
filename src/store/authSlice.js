import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setField(state, action) {
      let newState = { ...action.payload.data };
      return newState;
    },
    reset(state, action) {
      return initialState;
    },
  },
});

const store = configureStore({
  reducer: { auth: authSlice.reducer },
});

export const authActions = authSlice.actions;
export default store;
