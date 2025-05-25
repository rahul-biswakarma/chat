import React from "react";

import { Copy, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface UserListHeaderProps {
  userCount: number;
  chatRoomId?: string | null;
  onCopyRoomId: () => void;
  showRoomId?: boolean;
}

export function UserListHeader({
  userCount,
  chatRoomId,
  onCopyRoomId,
  showRoomId = true,
}: UserListHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>Users ({userCount})</span>
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
            onClick={onCopyRoomId}
            className="text-muted-foreground hover:text-foreground"
            title="Copy Room ID"
          >
            <Copy className="h-3 w-3" />
          </Button>
        )}
      </div>
      {chatRoomId && showRoomId && (
        <p className="text-xs text-muted-foreground truncate text-left">
          Room: {chatRoomId}
        </p>
      )}
    </>
  );
}
