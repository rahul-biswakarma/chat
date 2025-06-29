import React, { useRef } from "react";

import { SocketMessageTypes } from "@watchparty-org/teleparty-websocket-lib";

import TipTapEditor from "@/components/chat/tiptap-editor";
import TypingIndicator from "@/components/chat/typing-indicator";
import { Button } from "@/components/ui/button";

import { useChatContext } from "../context/chat.context";

export default function MessageInput() {
  const { client, isConnected, reconnect } = useChatContext();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTypingStart = () => {
    if (!client || !isConnected) return;

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
    if (!client || !isConnected) return;

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
      {!isConnected && (
        <div className="bg-red-500/10 text-red-500 text-sm p-2 mb-2 rounded-md flex items-center justify-between">
          <span>Connection lost. Messages cannot be sent.</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={reconnect}
            className="text-red-500 hover:text-red-600 hover:bg-red-500/20"
          >
            Reconnect
          </Button>
        </div>
      )}
      <TipTapEditor
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
      />
    </div>
  );
}
