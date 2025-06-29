import { SessionChatMessage } from "@watchparty-org/teleparty-websocket-lib";
import { Dexie, Table } from "dexie";

export interface ChatMessage extends SessionChatMessage {
  id?: number;
  roomId: string;
}

class ChatHistoryDatabase extends Dexie {
  public messages!: Table<ChatMessage, number>;

  public constructor() {
    super("ChatHistoryDatabase");
    this.version(1).stores({
      messages: "++id, roomId, timestamp",
    });
  }
}

const db = new ChatHistoryDatabase();

export const addMessageToDb = async (
  message: SessionChatMessage,
  roomId: string
): Promise<void> => {
  if (message.isSystemMessage) {
    return;
  }
  await db.messages.add({ ...message, roomId });
};

export const getMessagesForRoom = async (
  roomId: string
): Promise<ChatMessage[]> => {
  return await db.messages.where("roomId").equals(roomId).sortBy("timestamp");
};

export default db;
