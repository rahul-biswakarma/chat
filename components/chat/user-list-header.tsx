import React from "react";

import { Copy, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

interface UserListHeaderProps {
  userCount: number;
  chatRoomId: string | null;
  onCopyRoomId: () => void;
  isConnected: boolean;
}

export function UserListHeader({
  userCount,
  chatRoomId,
  onCopyRoomId,
  isConnected,
}: UserListHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">
            Users ({isConnected ? userCount : "..."})
          </h3>
        </div>
        {chatRoomId && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCopyRoomId}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            disabled={!isConnected}
          >
            <Copy className="h-4 w-4" />
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {isConnected ? "Online" : "Reconnecting..."}
      </p>
      {chatRoomId && (
        <p className="text-xs text-muted-foreground truncate">
          Room: {chatRoomId}
        </p>
      )}
    </div>
  );
}
