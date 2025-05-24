import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";
import {
  SessionChatMessage,
  SocketEventHandler,
  SocketMessageTypes,
  TelepartyClient,
} from "teleparty-websocket-lib";
import { SocketMessage } from "teleparty-websocket-lib/lib/SocketMessage";

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
  addSystemMessage: (text: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [client, setClient] = useState<TelepartyClient | null>(null);

  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>({
    nickname: DEFAULT_NICKNAME,
  });
  const [messages, setMessages] = useState<SessionChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [usersTyping, setUsersTyping] = useState<string[]>([]);

  const addSystemMessage = (text: string) => {
    const systemMessage: SessionChatMessage = {
      isSystemMessage: true,
      body: text,
      permId: "system",
      timestamp: Date.now(),
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
        const userList = message.data.map((user: any) => ({
          nickname: user.userSettings.userNickname || DEFAULT_NICKNAME,
          userIcon: user.userSettings.userIcon,
          socketId: user.socketConnectionId,
        }));
        setUsers(userList);
        break;
    }
  };

  const initializeClient = async () => {
    const eventHandler: SocketEventHandler = {
      onConnectionReady: () => {
        setIsConnected(true);
        toast.success("Connected to chat service", {
          description: "You can now create or join chat rooms",
        });
      },
      onClose: () => {
        setIsConnected(false);
        toast.error("Connection lost", {
          description: "Please reload the page to reconnect",
          duration: 5000,
        });
      },
      onMessage: handleIncomingMessage,
    };

    const telepartyClient = new TelepartyClient(eventHandler);
    setClient(telepartyClient);
  };

  // Add system message when room is set
  useEffect(() => {
    if (chatRoomId) {
      addSystemMessage(`Welcome to the chat room! Room ID: ${chatRoomId}`);
    }
  }, [chatRoomId]);

  useEffect(() => {
    try {
      initializeClient();
    } catch (error) {
      toast.error("Failed to connect to chat service", {
        description: "Please reload the page to try again",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
