import { createChatStore } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export const chatStore = createChatStore({
  transport: new DefaultChatTransport({
    api: "/api/chat",
  }),
  chats: {},
});