import React, { useRef } from "react";

import { SocketMessageTypes } from "teleparty-websocket-lib";

import TipTapEditor from "@/components/chat/tiptap-editor";
import TypingIndicator from "@/components/chat/typing-indicator";

import { useChatContext } from "../context/chat.context";

export default function MessageInput() {
  const { client } = useChatContext();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTypingStart = () => {
    if (!client) return;

    client.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, {
      typing: true,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleTypingStop();
    }, 3000);
  };

  const handleTypingStop = () => {
    if (!client) return;

    client.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, {
      typing: false,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  return (
    <div>
      <TypingIndicator />
      <TipTapEditor
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
      />
    </div>
  );
}
