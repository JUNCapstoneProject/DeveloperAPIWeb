import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  clientIds: [],
};

const clientIdSlice = createSlice({
  name: 'clientId',
  initialState,
  reducers: {
    setClientIds: (state, action) => {
      state.clientIds = action.payload;
    },
    addClientId: (state, action) => {
      state.clientIds.push(action.payload);
    },
    removeClientId: (state, action) => {
      state.clientIds = state.clientIds.filter(id => id !== action.payload);
    },
  },
});

export const { setClientIds, addClientId, removeClientId } = clientIdSlice.actions;

export default clientIdSlice.reducer; 