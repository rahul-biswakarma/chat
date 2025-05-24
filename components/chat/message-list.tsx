import React, { useEffect, useRef } from "react";

import TypingIndicator from "@/components/chat/typing-indicator";
import { useChatContext } from "@/components/context/chat.context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MessageList() {
  const { messages } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUserInitials = (nickname: string) => {
    return nickname
      .split(" ")
      .map(name => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.isSystemMessage ? "justify-center" : "justify-start"
          }`}
        >
          {message.isSystemMessage ? (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {message.body}
            </div>
          ) : (
            <div className="flex items-start space-x-3 max-w-xs">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={message.userIcon}
                  alt={message.userNickname || "User"}
                />
                <AvatarFallback className="bg-indigo-500 text-white text-xs">
                  {getUserInitials(message.userNickname || "Anonymous")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-sm text-gray-900">
                    {message.userNickname || "Anonymous"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
                <div className="bg-white border rounded-lg px-3 py-2 shadow-sm">
                  <p className="text-gray-800">{message.body}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <TypingIndicator />
      <div ref={messagesEndRef} />
    </div>
  );
}
