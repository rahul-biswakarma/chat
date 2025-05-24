import React, { useEffect, useRef } from "react";

import TypingIndicator from "@/components/chat/typing-indicator";
import { useChatContext } from "@/components/context/chat.context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ScrollArea } from "../ui/scroll-area";
import { formatTimestamp, getUserInitials } from "./utils";

export default function MessageList() {
  const { messages } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    // For ScrollArea, we need to find the viewport and scroll it
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (viewport) {
        setTimeout(() => {
          viewport.scrollTop = viewport.scrollHeight;
        }, 10);
      }
    }

    // Fallback: scroll to the messages end ref
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 10);
    }
  };

  const shouldShowUserInfo = (index: number) => {
    if (index === 0) return true;

    const currentMessage = messages[index];
    const previousMessage = messages[index - 1];

    if (currentMessage.isSystemMessage) return true;
    if (previousMessage.isSystemMessage) return true;

    return currentMessage.userNickname !== previousMessage.userNickname;
  };

  return (
    <div className="min-h-0 overflow-hidden">
      <ScrollArea ref={scrollAreaRef} className="h-full bg-background">
        <div className="p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.isSystemMessage ? "justify-center" : "justify-start"
              }`}
            >
              {message.isSystemMessage ? (
                <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm border border-border">
                  {message.body}
                </div>
              ) : (
                <div className="flex items-start space-x-3 max-w-[80%]">
                  {shouldShowUserInfo(index) ? (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage
                        src={message.userIcon}
                        alt={message.userNickname || "Guest"}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {getUserInitials(message.userNickname || "Guest")}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-8 h-8 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    {shouldShowUserInfo(index) && (
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-sm text-foreground">
                          {message.userNickname || "Anonymous"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                    )}
                    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-sm">
                      <p className="text-card-foreground text-sm whitespace-pre-wrap break-words">
                        {message.body}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <TypingIndicator />
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
