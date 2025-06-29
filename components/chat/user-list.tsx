import React from "react";

import { useChatContext } from "@/components/context/chat.context";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useUserList } from "@/hooks/use-user-list";

import { UserItem } from "./user-item";
import { UserListHeader } from "./user-list-header";

export default function UserList() {
  const { chatRoomId, users, currentUser, copyRoomId, getUserInitials } =
    useUserList();
  const { isConnected } = useChatContext();

  return (
    <Card className="bg-background border-border h-full !gap-0">
      <CardHeader className="p-4 pt-0 border-b border-border">
        <UserListHeader
          userCount={users.length}
          chatRoomId={chatRoomId}
          onCopyRoomId={copyRoomId}
          isConnected={isConnected}
        />
      </CardHeader>
      <CardContent className="p-2">
        <div className="space-y-2">
          {users.map((user, index) => (
            <UserItem
              key={user.socketId || index}
              user={user}
              index={index}
              currentUser={currentUser}
              getUserInitials={getUserInitials}
            />
          ))}
          {users.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-4">
              {isConnected ? "No users in this room yet" : "Reconnecting..."}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
