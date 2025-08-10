import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showProfileMenu: false,
  showNotifications: false,
  showMobileMenu: false,
  showChannels: false,
  showAddServerModal: false,
  showLogoutConfirm: false,
  showCreateChannelForm: false,
  isDirectMessagesSelected: true,
  callActive: false,
  callChannelId: null,
  isLoggingOut: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggle(state, action) {
      const key = action.payload;
      state[key] = !state[key];
    },
    set(state, action) {
      const { key, value } = action.payload;
      state[key] = value;
    },
  },
});

export const { toggle, set } = uiSlice.actions;
export default uiSlice.reducer;
