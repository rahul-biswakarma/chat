import React from "react";

import { useChatContext } from "@/components/context/chat.context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TypingIndicator() {
  const { usersTyping, users, currentUser } = useChatContext();

  if (usersTyping.length === 0) return null;

  const getTypingUsers = () => {
    return usersTyping
      .filter(socketId => socketId !== currentUser?.socketId)
      .map(socketId => users.find(user => user.socketId === socketId))
      .filter(Boolean);
  };

  const typingUsers = getTypingUsers();

  if (typingUsers.length === 0) return null;

  const getUserInitials = (nickname: string) => {
    return nickname
      .split(" ")
      .map(name => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserAvatar = (
    user:
      | { socketId?: string; userIcon?: string; nickname: string }
      | undefined,
    index: number
  ) => {
    const stackedStyle = index > 0 ? { marginLeft: -8 } : {};

    return (
      <Avatar
        key={user?.socketId || index}
        className="w-6 h-6 border-2 border-card"
        style={stackedStyle}
      >
        <AvatarImage src={user?.userIcon} alt={user?.nickname} />
        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
          {getUserInitials(user?.nickname || "?")}
        </AvatarFallback>
      </Avatar>
    );
  };

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0]?.nickname || "Someone"} is typing...`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0]?.nickname || "Someone"} and ${typingUsers[1]?.nickname || "someone"} are typing...`;
    } else {
      return `${typingUsers.length} people are typing...`;
    }
  };

  return (
    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg border border-border mx-4 mb-2">
      <div className="flex items-center">
        {typingUsers
          .slice(0, 3)
          .map((user, index) => getUserAvatar(user, index))}
        {typingUsers.length > 3 && (
          <div
            className="w-6 h-6 rounded-full bg-muted-foreground border-2 border-card flex items-center justify-center text-xs text-card font-medium"
            style={{ marginLeft: -8 }}
          >
            +{typingUsers.length - 3}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
          <div
            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          />
          <div
            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          />
        </div>
        <span className="text-sm text-foreground">{getTypingText()}</span>
      </div>
    </div>
  );
}
