import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import serverReducer from "./slices/serverSlice";
import channelReducer from "./slices/channelSlice";
import messageReducer from "./slices/messageSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    server: serverReducer,
    channel: channelReducer,
    message: messageReducer,
    ui: uiReducer,
  },
});
