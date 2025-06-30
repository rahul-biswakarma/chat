"use client";

import React, { useEffect, useRef, useState } from "react";

import { Loader2, MessageCircle, Users } from "lucide-react";
import { toast } from "sonner";

import { useChatContext } from "@/components/context/chat.context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ChatLobby() {
  const {
    client,
    isConnected,
    setChatRoomId,
    setCurrentUser,
    reconnect,
    setMessages,
  } = useChatContext();

  const [nickname, setNickname] = useState("");
  const [userIcon, setUserIcon] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const isConnectedRef = useRef(isConnected);
  useEffect(() => {
    isConnectedRef.current = isConnected;
  }, [isConnected]);

  const shortenUrl = async (url: string) => {
    if (url.length < 50) {
      return url;
    }

    try {
      const response = await fetch("/api/shorten-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to shorten URL");
      }

      const data = await response.json();
      toast.success("Avatar URL shortened successfully!");
      return data.shortUrl;
    } catch (error) {
      toast.error("Failed to shorten avatar URL", {
        description: "The original URL will be used instead.",
      });
      return url;
    }
  };

  const waitForConnection = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (isConnectedRef.current) {
        return resolve();
      }
      reconnect();
      const timeout = setTimeout(() => {
        clearInterval(interval);
        reject(new Error("Connection timed out"));
      }, 10000);
      const interval = setInterval(() => {
        if (isConnectedRef.current) {
          clearTimeout(timeout);
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  };

  const createChatRoom = async () => {
    if (!client || !nickname.trim()) {
      toast.error("Please enter a nickname", {
        description: "A nickname is required to create a chat room",
      });
      return;
    }

    if (!isConnected) {
      toast.error("Connection not ready", {
        description: "Please wait for connection to be established",
      });
      return;
    }

    try {
      setIsCreating(true);
      await waitForConnection();
      const finalUserIcon = userIcon ? await shortenUrl(userIcon) : "";

      const newRoomId = await client.createChatRoom(
        nickname.trim(),
        finalUserIcon
      );

      const currentNickname = nickname.trim();
      const currentUserIcon = finalUserIcon || undefined;

      setCurrentUser(prev => ({
        ...prev,
        nickname: currentNickname,
        userIcon: currentUserIcon,
      }));

      // Add creation message
      const creationMessage = {
        isSystemMessage: true,
        body: "created the party",
        permId: "system",
        timestamp: Date.now(),
        userNickname: currentNickname,
        userIcon: currentUserIcon,
      };
      setMessages([creationMessage]); // Set initial message
      setChatRoomId(newRoomId);
      toast.success("Chat room created!", {
        description: `Room ID: ${newRoomId}`,
        duration: 5000,
      });
    } catch (error) {
      console.error("Failed to create room:", error);
      toast.error("Failed to create chat room", {
        description: "Please try again",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const joinChatRoom = async () => {
    if (!client || !nickname.trim() || !joinRoomId.trim()) {
      toast.error("Missing information", {
        description: "Please enter both nickname and room ID",
      });
      return;
    }

    if (!isConnected) {
      toast.error("Connection not ready", {
        description: "Please wait for connection to be established",
      });
      return;
    }

    try {
      setIsJoining(true);
      await waitForConnection();
      const finalUserIcon = userIcon ? await shortenUrl(userIcon) : "";

      await client.joinChatRoom(
        nickname.trim(),
        joinRoomId.trim(),
        finalUserIcon
      );

      const currentNickname = nickname.trim();
      const currentUserIcon = finalUserIcon || undefined;

      setCurrentUser(prev => ({
        ...prev,
        nickname: currentNickname,
        userIcon: currentUserIcon,
      }));

      setChatRoomId(joinRoomId.trim());
      toast.success("Joined chat room!", {
        description: `Welcome to room: ${joinRoomId.trim()}`,
        duration: 3000,
      });
    } catch {
      toast.error("Failed to join chat room", {
        description: "Please check the room ID and try again",
      });
    } finally {
      setIsJoining(false);
    }
  };

  const getConnectionStatus = () => {
    if (isConnected) return { text: "Connected", color: "text-chart-2" };
    return { text: "Connecting...", color: "text-chart-1" };
  };

  const status = getConnectionStatus();

  return (
    <ScrollArea>
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-md pt-20">
          <div className="text-center mb-8">
            <MessageCircle className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Teleparty Chat
            </h1>
            <p className="text-muted-foreground">
              Connect with friends in real-time
            </p>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-center text-card-foreground">
                Get Started
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="nickname" className="text-card-foreground">
                    Nickname
                  </Label>
                  <Input
                    id="nickname"
                    placeholder="Enter your nickname"
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground/40"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="userIcon" className="text-card-foreground">
                    Profile Image URL (optional)
                  </Label>
                  <Input
                    id="userIcon"
                    placeholder="https://example.com/avatar.jpg"
                    value={userIcon}
                    onChange={e => setUserIcon(e.target.value)}
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground/40"
                  />
                </div>

                <div className="flex items-center justify-center space-x-2 py-2">
                  <div className="flex-1 border-t border-border" />
                  <span className="text-sm text-muted-foreground">next</span>
                  <div className="flex-1 border-t border-border" />
                </div>

                <Tabs defaultValue="create" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-muted">
                    <TabsTrigger
                      value="create"
                      className="data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      Create Room
                    </TabsTrigger>
                    <TabsTrigger
                      value="join"
                      className="data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      Join Room
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="create" className="space-y-4">
                    <Button
                      onClick={createChatRoom}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      disabled={!nickname.trim() || isCreating}
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Users className="mr-2 h-4 w-4" />
                          Create Chat Room
                        </>
                      )}
                    </Button>
                  </TabsContent>

                  <TabsContent value="join" className="space-y-4 pt-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="roomId" className="text-card-foreground">
                        Room ID
                      </Label>
                      <Input
                        id="roomId"
                        placeholder="Enter room ID"
                        value={joinRoomId}
                        onChange={e => setJoinRoomId(e.target.value)}
                        className="mt-1 bg-background border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <Button
                      onClick={joinChatRoom}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      disabled={
                        !nickname.trim() || !joinRoomId.trim() || isJoining
                      }
                    >
                      {isJoining ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Joining...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="h-4 w-4" />
                          Join Chat Room
                        </>
                      )}
                    </Button>
                  </TabsContent>
                </Tabs>

                <div className="text-center text-sm text-muted-foreground">
                  Status:{" "}
                  <span className={`font-medium ${status.color}`}>
                    {status.text}
                  </span>
                  {!isConnected && (
                    <Button
                      variant="link"
                      size="sm"
                      onClick={reconnect}
                      className="text-primary hover:text-primary/80 ml-2"
                    >
                      Retry
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
