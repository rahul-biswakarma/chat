"use client";

import React from "react";

import { MessageCircle } from "lucide-react";

import MessageInput from "@/components/chat/message-input";
import MessageList from "@/components/chat/message-list";
import MobileUsersMenu from "@/components/chat/mobile-users-menu";
import UserList from "@/components/chat/user-list";
import { useChatContext } from "@/components/context/chat.context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ChatRoom() {
  const {
    currentUser,
    setChatRoomId,
    setMessages,
    client,
    isConnected,
    disconnect,
  } = useChatContext();

  const leaveRoom = () => {
    disconnect();
    setMessages([]);
  };

  return (
    <div className="h-screen bg-background grid grid-rows-[1fr] overflow-hidden">
      <div className="container mx-auto max-w-7xl p-4 min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
          <div className="lg:col-span-9 min-h-0">
            <Card className="bg-background border-border h-full grid grid-rows-[auto_1fr] gap-0 pb-4 pt-0 overflow-hidden">
              <CardHeader className="bg-card p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-card-foreground">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      <span className="hidden sm:inline">Chat Room</span>
                      <span className="sm:hidden">Chat</span>
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground mt-1">
                        Welcome, {currentUser?.nickname}!
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MobileUsersMenu />
                    <Button
                      variant="outline"
                      onClick={leaveRoom}
                      size="sm"
                      className="border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      Leave
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0 bg-background min-h-0 grid grid-rows-[1fr_auto]">
                <MessageList />
                <MessageInput />
              </CardContent>
            </Card>
          </div>

          <div className="hidden lg:block lg:col-span-3">
            <UserList />
          </div>
        </div>
      </div>
    </div>
  );
}
