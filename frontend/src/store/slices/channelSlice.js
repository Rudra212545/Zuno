import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  channels: [],
  currentChannel: "general",
  currentChannelId: null,
};

const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    setChannels(state, action) {
      state.channels = action.payload;
    },
    setCurrentChannel(state, action) {
      state.currentChannel = action.payload;
    },
    setCurrentChannelId(state, action) {
      state.currentChannelId = action.payload;
    },
    addChannel(state, action) {
      state.channels.push(action.payload);
    },
  },
});

export const { setChannels, setCurrentChannel, setCurrentChannelId, addChannel } = channelSlice.actions;
export default channelSlice.reducer;
