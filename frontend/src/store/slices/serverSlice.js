import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  servers: [],
  selectedServer: null,
};

const serverSlice = createSlice({
  name: "server",
  initialState,
  reducers: {
    setServers(state, action) {
      state.servers = action.payload;
    },
    selectServer(state, action) {
      state.selectedServer = action.payload;
    },
    addServer(state, action) {
      state.servers.push(action.payload);
    },
  },
});

export const { setServers, selectServer, addServer } = serverSlice.actions;
export default serverSlice.reducer;
