export interface User {
  nickname: string;
  userIcon?: string;
  socketId?: string;
}

export interface TypingMessageData {
  anyoneTyping: boolean;
  usersTyping: string[];
}
