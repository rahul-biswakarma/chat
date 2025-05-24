import React, { useRef, useState } from "react";

import { Send } from "lucide-react";
import { toast } from "sonner";
import { SocketMessageTypes } from "teleparty-websocket-lib";

import { useChatContext } from "@/components/context/chat.context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MessageInput() {
  const { client } = useChatContext();
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sendMessage = () => {
    if (!client || !newMessage.trim()) return;

    try {
      client.sendMessage(SocketMessageTypes.SEND_MESSAGE, {
        body: newMessage.trim(),
      });
      setNewMessage("");
      handleTypingStop();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message", {
        description: "Please try again",
      });
    }
  };

  const handleTypingStart = () => {
    if (!client || isTyping) return;

    setIsTyping(true);
    client.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, {
      typing: true,
    });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      handleTypingStop();
    }, 3000);
  };

  const handleTypingStop = () => {
    if (!client || !isTyping) return;

    setIsTyping(false);
    client.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, {
      typing: false,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (e.target.value.trim()) {
      handleTypingStart();
    } else {
      handleTypingStop();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="border-t p-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Type your message..."
          value={newMessage}
          onChange={handleMessageChange}
          onKeyUp={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={sendMessage} disabled={!newMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
