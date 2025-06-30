"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  SessionChatMessage,
  SocketMessageTypes,
  TelepartyClient,
} from "@watchparty-org/teleparty-websocket-lib";
import { SocketMessage } from "@watchparty-org/teleparty-websocket-lib/lib/SocketMessage";
import { nanoid } from "nanoid";

import { addMessageToDb, getMessagesForRoom } from "@/lib/db";
import { User } from "@/lib/type";

export const DEFAULT_NICKNAME = "Guest";

const getTabId = () => {
  if (typeof window === "undefined") {
    return "";
  }
  let tabId = localStorage.getItem("teleparty_tab_id");
  if (!tabId) {
    tabId = nanoid();
    localStorage.setItem("teleparty_tab_id", tabId);
  }
  return tabId;
};

const TAB_ID = getTabId();

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
  const [chatRoomId, setChatRoomId] = useState<string | null>(() =>
    typeof window !== "undefined"
      ? sessionStorage.getItem(CHAT_ROOM_STORAGE_KEY)
      : null
  );
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return { nickname: DEFAULT_NICKNAME };
    const savedNickname = sessionStorage.getItem(USER_NICKNAME_STORAGE_KEY);
    const savedIcon = sessionStorage.getItem(USER_ICON_STORAGE_KEY);
    return {
      nickname: savedNickname || DEFAULT_NICKNAME,
      userIcon: savedIcon || undefined,
    };
  });
  const [messages, setMessages] = useState<SessionChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(!!chatRoomId);
  const [users, setUsers] = useState<User[]>([]);
  const [usersTyping, setUsersTyping] = useState<string[]>([]);

  const chatRoomIdRef = useRef(chatRoomId);
  useEffect(() => {
    chatRoomIdRef.current = chatRoomId;
  }, [chatRoomId]);

  const currentUserRef = useRef(currentUser);
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const addSystemMessage = useCallback((text: string, user?: User) => {
    const systemMessage: SessionChatMessage = {
      isSystemMessage: true,
      body: text,
      permId: "system",
      timestamp: Date.now(),
      ...(user && { userNickname: user.nickname, userIcon: user.userIcon }),
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
        if (chatRoomIdRef.current) {
          const messageData = message.data;
          addMessageToDb(messageData, chatRoomIdRef.current);
          setMessages(prev => [...prev, messageData]);
        }
        break;
      case SocketMessageTypes.SET_TYPING_PRESENCE:
        setCurrentUser(prevUser => {
          setUsersTyping(
            message.data.usersTyping.filter(
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
        if (chatRoomIdRef.current && currentUserRef.current?.nickname) {
          try {
            await newClient.joinChatRoom(
              currentUserRef.current.nickname,
              chatRoomIdRef.current,
              currentUserRef.current.userIcon
            );
            const history = await getMessagesForRoom(chatRoomIdRef.current);
            const recentJoinMessage = history
              ?.slice(-10)
              .find(
                msg =>
                  msg.isSystemMessage &&
                  msg.body === "joined the party" &&
                  msg.userNickname === currentUserRef.current?.nickname
              );

            if (!isReconnecting && !recentJoinMessage) {
              const systemMessage: SessionChatMessage = {
                isSystemMessage: true,
                body: "joined the party",
                permId: "system",
                timestamp: Date.now(),
                userNickname: currentUserRef.current.nickname,
                userIcon: currentUserRef.current.userIcon,
              };

              if (chatRoomIdRef.current) {
                await addMessageToDb(systemMessage, chatRoomIdRef.current);
              }
              setMessages([...(history || []), systemMessage]);
            } else {
              setMessages(history || []);
            }
          } catch (error) {
            console.error("Failed to rejoin chat room:", error);
            setChatRoomId(null);
            sessionStorage.removeItem(CHAT_ROOM_STORAGE_KEY);
          }
        }
        setIsReconnecting(false);
      },
      onClose: async () => {
        if (chatRoomIdRef.current && currentUserRef.current?.nickname) {
          const leftMessage: SessionChatMessage = {
            isSystemMessage: true,
            body: "left",
            permId: "system",
            timestamp: Date.now(),
            userNickname: currentUserRef.current.nickname,
            userIcon: currentUserRef.current.userIcon,
          };
          await addMessageToDb(leftMessage, chatRoomIdRef.current);
          setMessages(prev => [...prev, leftMessage]);
        }

        setIsConnected(false);
        setUsers([]);
        setUsersTyping([]);
        setClient(c => (c === newClient ? null : c));
      },
      onMessage: handleIncomingMessage,
    });
    setClient(newClient);
  }, [handleIncomingMessage]);

  const reconnect = useCallback(() => {
    if (client) {
      client.teardown();
    }
    if (chatRoomId) {
      setIsReconnecting(true);
    }
    setClient(null);
  }, [client, chatRoomId]);

  useEffect(() => {
    if (!client) {
      connect();
    }
  }, [client, connect]);

  useEffect(() => {
    if (chatRoomId) {
      sessionStorage.setItem(CHAT_ROOM_STORAGE_KEY, chatRoomId);
    } else {
      sessionStorage.removeItem(CHAT_ROOM_STORAGE_KEY);
      setMessages([]);
    }
  }, [chatRoomId]);

  useEffect(() => {
    if (currentUser?.nickname) {
      sessionStorage.setItem(USER_NICKNAME_STORAGE_KEY, currentUser.nickname);
    }
    if (currentUser?.userIcon) {
      sessionStorage.setItem(USER_ICON_STORAGE_KEY, currentUser.userIcon);
    } else {
      sessionStorage.removeItem(USER_ICON_STORAGE_KEY);
    }
  }, [currentUser]);

  const disconnect = () => {
    if (client) {
      client.teardown();
      setClient(null);
    }
    setIsConnected(false);
    setUsers([]);
    setUsersTyping([]);
    setChatRoomId(null);
    sessionStorage.removeItem(CHAT_ROOM_STORAGE_KEY);
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
