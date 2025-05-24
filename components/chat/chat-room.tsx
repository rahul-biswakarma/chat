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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[90vh]">
          <div className="lg:hidden">
            <UserList />
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-9">
            <Card className="h-full flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      <span className="hidden sm:inline">Chat Room</span>
                      <span className="sm:hidden">Chat</span>
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Welcome, {currentUser?.nickname}!
                    </p>
                  </div>
                  <Button variant="outline" onClick={leaveRoom} size="sm">
                    Leave
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
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
