// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import clientIdReducer from "./features/clientIdSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    clientId: clientIdReducer,
  },
});

export default store;
