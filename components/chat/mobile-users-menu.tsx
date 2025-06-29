"use client";

import React from "react";

import { Users } from "lucide-react";

import { useChatContext } from "@/components/context/chat.context";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUserList } from "@/hooks/use-user-list";

import { UserItem } from "./user-item";
import { UserListHeader } from "./user-list-header";

export default function MobileUsersMenu() {
  const { chatRoomId, users, currentUser, copyRoomId, getUserInitials } =
    useUserList();
  const { isConnected } = useChatContext();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="lg:hidden border-border text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Users className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 border-border p-2">
        <SheetHeader>
          <SheetTitle>
            <div className="flex flex-row items-center">
              <div>
                <UserListHeader
                  userCount={users.length}
                  chatRoomId={chatRoomId}
                  onCopyRoomId={copyRoomId}
                  isConnected={isConnected}
                />
              </div>
              <SheetClose className="!relative" />
            </div>
          </SheetTitle>
        </SheetHeader>

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
      </SheetContent>
    </Sheet>
  );
}
