"use client";

import { useEffect, useState } from "react";

import ChatLobby from "@/components/chat/chat-lobby";
import ChatRoom from "@/components/chat/chat-room";
import { useChatContext } from "@/components/context/chat.context";

export default function Page() {
  const { chatRoomId } = useChatContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Render the lobby on the server and initial client render
    // to avoid hydration mismatch.
    return <ChatLobby />;
  }

  return chatRoomId ? <ChatRoom /> : <ChatLobby />;
}
