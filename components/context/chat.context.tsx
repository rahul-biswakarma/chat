"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  SessionChatMessage,
  SocketMessageTypes,
  TelepartyClient,
} from "@watchparty-org/teleparty-websocket-lib";
import { SocketMessage } from "@watchparty-org/teleparty-websocket-lib/lib/SocketMessage";
import { nanoid } from "nanoid";

import { User } from "@/lib/type";

export const DEFAULT_NICKNAME = "Guest";

// Generate a unique ID for this tab instance
const TAB_ID = typeof window !== "undefined" ? nanoid() : "";

const getStorageKey = (key: string) => `teleparty_${key}_${TAB_ID}`;

const CHAT_ROOM_STORAGE_KEY = getStorageKey("chat_room_id");
const USER_NICKNAME_STORAGE_KEY = getStorageKey("user_nickname");
const USER_ICON_STORAGE_KEY = getStorageKey("user_icon");

interface ChatContextType {
  client: TelepartyClient | null;
  isConnected: boolean;
  isReconnecting: boolean;
  chatRoomId: string | null;
  setChatRoomId: Dispatch<SetStateAction<string | null>>;
  currentUser: User | null;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
  users: User[];
  usersTyping: string[];
  messages: SessionChatMessage[];
  setMessages: Dispatch<SetStateAction<SessionChatMessage[]>>;
  addSystemMessage: (text: string, user?: User) => void;
  reconnect: () => void;
  disconnect: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [client, setClient] = useState<TelepartyClient | null>(null);

  const [chatRoomId, setChatRoomId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(CHAT_ROOM_STORAGE_KEY);
    }
    return null;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const savedNickname = localStorage.getItem(USER_NICKNAME_STORAGE_KEY);
      const savedIcon = localStorage.getItem(USER_ICON_STORAGE_KEY);
      return {
        nickname: savedNickname || DEFAULT_NICKNAME,
        userIcon: savedIcon || undefined,
      };
    }
    return { nickname: DEFAULT_NICKNAME };
  });

  const [messages, setMessages] = useState<SessionChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [usersTyping, setUsersTyping] = useState<string[]>([]);
  const [isIntentionalDisconnect, setIsIntentionalDisconnect] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const addSystemMessage = useCallback((text: string, user?: User) => {
    const systemMessage: SessionChatMessage = {
      isSystemMessage: true,
      body: text,
      permId: "system",
      timestamp: Date.now(),
      ...(user && {
        userNickname: user.nickname,
        userIcon: user.userIcon,
      }),
    };
    setMessages(prev => [...prev, systemMessage]);
  }, []);

  const handleIncomingMessage = useCallback((message: SocketMessage) => {
    switch (message.type) {
      case "userId":
        const userId: string = message.data.userId;
        setCurrentUser(prev =>
          prev
            ? { ...prev, socketId: userId }
            : { nickname: DEFAULT_NICKNAME, socketId: userId }
        );
        break;

      case SocketMessageTypes.SEND_MESSAGE:
        const chatMessage: SessionChatMessage = message.data;
        setMessages(prev => [...prev, chatMessage]);
        break;

      case SocketMessageTypes.SET_TYPING_PRESENCE:
        const usersTyping = message.data.usersTyping;
        setCurrentUser(prevUser => {
          setUsersTyping(
            usersTyping.filter(
              (userId: string) => userId !== prevUser?.socketId
            ) || []
          );
          return prevUser;
        });
        break;

      case "userList":
        const userList = message.data.map(
          (user: {
            userSettings: { userNickname?: string; userIcon?: string };
            socketConnectionId: string;
          }) => ({
            nickname: user.userSettings.userNickname || DEFAULT_NICKNAME,
            userIcon: user.userSettings.userIcon,
            socketId: user.socketConnectionId,
          })
        );
        setUsers(userList);
        break;
    }
  }, []);

  const connect = useCallback(() => {
    const newClient = new TelepartyClient({
      onConnectionReady: async () => {
        setIsConnected(true);
        if (chatRoomId && currentUser?.nickname) {
          try {
            await newClient.joinChatRoom(
              currentUser.nickname,
              chatRoomId,
              currentUser.userIcon
            );
          } catch (error) {
            setChatRoomId(null);
            if (typeof window !== "undefined") {
              localStorage.removeItem(CHAT_ROOM_STORAGE_KEY);
            }
          }
        }
        setIsReconnecting(false);
      },
      onClose: () => {
        setIsConnected(false);
        setUsers([]);
        setUsersTyping([]);
        setClient(c => (c === newClient ? null : c));
      },
      onMessage: handleIncomingMessage,
    });
    setClient(newClient);
  }, [handleIncomingMessage, chatRoomId, currentUser, addSystemMessage]);

  const reconnect = useCallback(() => {
    if (client) {
      client.teardown();
    }
    setClient(null);
    setIsIntentionalDisconnect(false);
    setIsReconnecting(true);
  }, [client]);

  useEffect(() => {
    if (!client && !isIntentionalDisconnect) {
      const timeoutId = setTimeout(() => {
        connect();
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [client, isIntentionalDisconnect, connect]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !isConnected) {
        reconnect();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isConnected, reconnect]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (chatRoomId) {
        localStorage.setItem(CHAT_ROOM_STORAGE_KEY, chatRoomId);
        addSystemMessage(`Welcome to the chat room! Room ID: ${chatRoomId}`);
      } else {
        localStorage.removeItem(CHAT_ROOM_STORAGE_KEY);
      }
    }
  }, [chatRoomId, addSystemMessage]);

  useEffect(() => {
    if (typeof window !== "undefined" && currentUser) {
      if (currentUser.nickname) {
        localStorage.setItem(USER_NICKNAME_STORAGE_KEY, currentUser.nickname);
      }
      if (currentUser.userIcon) {
        localStorage.setItem(USER_ICON_STORAGE_KEY, currentUser.userIcon);
      } else {
        localStorage.removeItem(USER_ICON_STORAGE_KEY);
      }
    }
  }, [currentUser]);

  const disconnect = () => {
    setIsIntentionalDisconnect(true);
    if (client) {
      client.teardown();
      setClient(null);
    }
    setIsConnected(false);
    setUsers([]);
    setUsersTyping([]);
    setChatRoomId(null);

    if (typeof window !== "undefined") {
      localStorage.removeItem(CHAT_ROOM_STORAGE_KEY);
    }

    addSystemMessage("Disconnected from chat service");
  };

  return (
    <ChatContext.Provider
      value={{
        client,
        isConnected,
        isReconnecting,
        chatRoomId,
        setChatRoomId,
        currentUser,
        setCurrentUser,
        users,
        usersTyping,
        messages,
        setMessages,
        addSystemMessage,
        reconnect,
        disconnect,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatContextProvider");
  }
  return context;
};
