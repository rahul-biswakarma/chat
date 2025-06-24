import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  SessionChatMessage,
  SocketEventHandler,
  SocketMessageTypes,
  TelepartyClient,
} from "@watchparty-org/teleparty-websocket-lib";
import { SocketMessage } from "@watchparty-org/teleparty-websocket-lib/lib/SocketMessage";
import { toast } from "sonner";

import { User } from "@/lib/type";

export const DEFAULT_NICKNAME = "Guest";

interface ChatContextType {
  client: TelepartyClient | null;
  isConnected: boolean;
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

const CHAT_ROOM_STORAGE_KEY = "teleparty_chat_room_id";
const USER_NICKNAME_STORAGE_KEY = "teleparty_user_nickname";
const USER_ICON_STORAGE_KEY = "teleparty_user_icon";

export const ChatContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [client, setClient] = useState<TelepartyClient | null>(null);

  // initialize chatRoomId from localStorage
  const [chatRoomId, setChatRoomId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(CHAT_ROOM_STORAGE_KEY);
    }
    return null;
  });

  // initialize currentUser from localStorage
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

  const reconnect = () => {
    if (!isConnected) {
      setIsIntentionalDisconnect(false);
      initializeClient();
    }
  };

  const addSystemMessage = (text: string, user?: User) => {
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
  };

  const handleIncomingMessage = (message: SocketMessage) => {
    switch (message.type) {
      case "userId":
        const userId: string = message.data.userId;
        setCurrentUser(prev => {
          return prev
            ? { ...prev, socketId: userId }
            : { nickname: DEFAULT_NICKNAME, socketId: userId };
        });
        break;

      case SocketMessageTypes.SEND_MESSAGE:
        const chatMessage: SessionChatMessage = message.data;
        setMessages(prev => [...prev, chatMessage]);
        break;

      case SocketMessageTypes.SET_TYPING_PRESENCE:
        const usersTyping = message.data.usersTyping;
        setUsersTyping(
          usersTyping.filter(
            (userId: string) => userId !== currentUser?.socketId
          ) || []
        );
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
  };

  const initializeClient = async () => {
    const eventHandler: SocketEventHandler = {
      onConnectionReady: () => {
        setIsConnected(true);
        setIsIntentionalDisconnect(false);

        // if we were previously in a chat room, try to rejoin
        if (chatRoomId && currentUser?.nickname) {
          toast.success("Reconnected to chat service", {
            description: "Attempting to rejoin chat room...",
          });

          // attempt to rejoin the chat room
          setTimeout(async () => {
            try {
              await telepartyClient.joinChatRoom(
                currentUser.nickname,
                chatRoomId,
                currentUser.userIcon
              );
              addSystemMessage("Reconnected to chat room");
            } catch (error) {
              console.error("Failed to rejoin room:", error);
              toast.error("Failed to rejoin chat room", {
                description:
                  "The room may no longer exist. Please create or join a new room.",
                duration: 5000,
              });
              setChatRoomId(null);
            }
          }, 1000);
        } else {
          toast.success("Connected to chat service", {
            description: "You can now create or join chat rooms",
          });
        }
      },
      onClose: () => {
        setIsConnected(false);
        setUsers([]);
        setUsersTyping([]);

        // only show reconnection toast and attempt reconnection if it wasn't intentional
        if (!isIntentionalDisconnect) {
          toast.error("Connection lost", {
            description: "Attempting to reconnect...",
            duration: 5000,
          });

          // attempt to reconnect after a delay
          setTimeout(() => {
            if (!isConnected && !isIntentionalDisconnect) {
              initializeClient();
            }
          }, 3000);
        }
      },
      onMessage: handleIncomingMessage,
    };

    const telepartyClient = new TelepartyClient(eventHandler);
    setClient(telepartyClient);
  };

  // save chatRoomId to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (chatRoomId) {
        localStorage.setItem(CHAT_ROOM_STORAGE_KEY, chatRoomId);
        addSystemMessage(`Welcome to the chat room! Room ID: ${chatRoomId}`);
      } else {
        localStorage.removeItem(CHAT_ROOM_STORAGE_KEY);
      }
    }
  }, [chatRoomId]);

  // save currentUser to localStorage when it changes
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

  useEffect(() => {
    try {
      initializeClient();
    } catch {
      toast.error("Failed to connect to chat service", {
        description: "Please reload the page to try again",
      });
    }
  }, []);

  const disconnect = () => {
    setIsIntentionalDisconnect(true);
    if (client) {
      client.teardown();
    }
    setIsConnected(false);
    setUsers([]);
    setUsersTyping([]);
    setChatRoomId(null);

    // clear localStorage when intentionally disconnecting
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
  if (!context) {
    throw new Error("useChatContext must be used within a ChatContextProvider");
  }
  return context;
};
