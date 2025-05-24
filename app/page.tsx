"use client";

import React from "react";

import ChatLobby from "@/components/chat/chat-lobby";
import ChatRoom from "@/components/chat/chat-room";
import {
  ChatContextProvider,
  useChatContext,
} from "@/components/context/chat.context";

function ChatApp() {
  const { chatRoomId } = useChatContext();

  return chatRoomId ? <ChatRoom /> : <ChatLobby />;
}

export default function Page() {
  return (
    <ChatContextProvider>
      <ChatApp />
    </ChatContextProvider>
  );
}
