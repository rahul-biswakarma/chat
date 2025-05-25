import React, { useEffect, useRef } from "react";

import TipTapEditor from "@/components/chat/tiptap-editor";
import TypingIndicator from "@/components/chat/typing-indicator";
import { useChatContext } from "@/components/context/chat.context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ScrollArea } from "../ui/scroll-area";
import { formatTimestamp, getUserInitials } from "./utils";

export default function MessageList() {
  const { messages } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
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
      <ScrollArea className="h-full bg-background">
        <div className="flex flex-col p-4">
          {messages.map((message, index) => {
            const showUserInfo = shouldShowUserInfo(index);

            return (
              <div
                key={index}
                className={`flex ${
                  message.isSystemMessage ? "justify-center" : "justify-start"
                } ${showUserInfo ? "pt-4" : "pt-2"}`}
              >
                {message.isSystemMessage ? (
                  message.userNickname ? (
                    <div className="flex gap-1 items-center bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm border border-border">
                      <Avatar className="w-6 h-6 flex-shrink-0">
                        <AvatarImage
                          src={message.userIcon}
                          alt={message.userNickname}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getUserInitials(message.userNickname)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-primary-foreground font-semibold">
                        {message.userNickname}
                      </span>
                      <i className="text-muted-foreground">{message.body}</i>
                    </div>
                  ) : (
                    <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm border border-border">
                      {message.body}
                    </div>
                  )
                ) : (
                  <div className="flex items-start space-x-3 max-w-[80%]">
                    {showUserInfo ? (
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
                        <TipTapEditor
                          content={JSON.parse((message as any).body)}
                          readonly
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <TypingIndicator />
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
