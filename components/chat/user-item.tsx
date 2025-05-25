import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface User {
  socketId?: string;
  nickname: string;
  userIcon?: string;
}

interface UserItemProps {
  user: User;
  index: number;
  currentUser?: User | null;
  getUserInitials: (nickname: string) => string;
}

export function UserItem({
  user,
  index,
  currentUser,
  getUserInitials,
}: UserItemProps) {
  const isCurrentUser = user.socketId === currentUser?.socketId;

  return (
    <div
      key={user.socketId || index}
      className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
        isCurrentUser
          ? "bg-accent/50 border border-border"
          : "bg-muted hover:bg-muted"
      }`}
    >
      <div className="relative">
        <Avatar className="w-8 h-8">
          <AvatarImage src={user.userIcon} alt={user.nickname} />
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            {getUserInitials(user.nickname)}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-chart-2 border-2 border-card rounded-full" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-foreground truncate">
            {user.nickname}
          </span>
          {isCurrentUser && (
            <Badge
              variant="secondary"
              className="text-mono text-xs bg-accent text-accent-foreground"
            >
              You
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
