import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserList } from "@/hooks/use-user-list";

import { UserItem } from "./user-item";
import { UserListHeader } from "./user-list-header";

export default function UserList() {
  const { chatRoomId, users, currentUser, copyRoomId, getUserInitials } =
    useUserList();

  return (
    <Card className="h-full bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-card-foreground">
          <UserListHeader
            userCount={users.length}
            chatRoomId={chatRoomId}
            onCopyRoomId={copyRoomId}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
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
              No users in this room yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
