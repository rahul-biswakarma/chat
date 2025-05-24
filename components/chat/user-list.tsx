import React from "react";

import { Copy, Users } from "lucide-react";
import { toast } from "sonner";

import { useChatContext } from "@/components/context/chat.context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserList() {
  const { chatRoomId, users, currentUser } = useChatContext();

  const copyRoomId = async () => {
    if (chatRoomId) {
      try {
        await navigator.clipboard.writeText(chatRoomId);
        toast.success("Room ID copied to clipboard!", {
          description: `Room ID: ${chatRoomId}`,
          duration: 3000,
        });
      } catch (error) {
        console.error("Failed to copy room ID:", error);
        toast.error("Failed to copy room ID", {
          description: "Please try again or copy manually",
        });
      }
    }
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
    <Card className="h-full bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm text-card-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Users ({users.length})</span>
            <Badge
              variant="secondary"
              className="text-xs bg-secondary text-secondary-foreground"
            >
              Online
            </Badge>
          </div>
          {chatRoomId && (
            <Button
              variant="ghost"
              size="icon"
              onClick={copyRoomId}
              className="text-muted-foreground hover:text-foreground"
              title="Copy Room ID"
            >
              <Copy className="h-3 w-3" />
            </Button>
          )}
        </CardTitle>
        {chatRoomId && (
          <p className="text-xs text-muted-foreground truncate">
            Room: {chatRoomId}
          </p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {users.map((user, index) => (
            <div
              key={user.socketId || index}
              className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
                user.socketId === currentUser?.socketId
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
                  <span className="text-sm font-medium text-card-foreground truncate">
                    {user.nickname}
                  </span>
                  {user.socketId === currentUser?.socketId && (
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
          ))}
          {users.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-4">
              No users in this room yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
