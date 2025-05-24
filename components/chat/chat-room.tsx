"use client";

import React from "react";

import { MessageCircle } from "lucide-react";

import MessageInput from "@/components/chat/message-input";
import MessageList from "@/components/chat/message-list";
import UserList from "@/components/chat/user-list";
import { useChatContext } from "@/components/context/chat.context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ChatRoom() {
  const { currentUser, setChatRoomId, setMessages } = useChatContext();

  const leaveRoom = () => {
    setChatRoomId(null);
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-2rem)]">
          <div className="lg:col-span-9 flex flex-col">
            <Card className="bg-card border-border flex-1 flex flex-col">
              <CardHeader className="bg-card">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-card-foreground">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      <span className="hidden sm:inline">Chat Room</span>
                      <span className="sm:hidden">Chat</span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Welcome, {currentUser?.nickname}!
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={leaveRoom}
                    size="sm"
                    className="border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    Leave
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0 bg-background">
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
