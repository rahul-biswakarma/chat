import { toast } from "sonner";

import { useChatContext } from "@/components/context/chat.context";

export function useUserList() {
  const { chatRoomId, users, currentUser } = useChatContext();

  const copyRoomId = async () => {
    if (chatRoomId) {
      try {
        await navigator.clipboard.writeText(chatRoomId);
        toast.success("Room ID copied to clipboard!", {
          description: `Room ID: ${chatRoomId}`,
          duration: 3000,
        });
      } catch {
        toast.error("Failed to copy room ID", {
          description: "Please try again or copy manually",
        });
      }
    }
  };

  const getUserInitials = (nickname: string) => {
    return nickname
      .split(" ")
      .map(name => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return {
    chatRoomId,
    users,
    currentUser,
    copyRoomId,
    getUserInitials,
  };
}
