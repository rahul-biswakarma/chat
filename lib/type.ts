import { JSONContent } from "@tiptap/react";

export interface User {
  nickname: string;
  userIcon?: string;
  socketId?: string;
}

export interface TypingMessageData {
  anyoneTyping: boolean;
  usersTyping: string[];
}

export interface RichChatMessage {
  isSystemMessage?: boolean;
  body: string;
  richContent?: JSONContent;
  permId?: string;
  timestamp: number;
  userNickname?: string;
  userIcon?: string;
}
