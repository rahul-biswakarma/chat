import { JSONContent } from "@tiptap/react";

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else {
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
};

export const getUserInitials = (nickname: string): string => {
  return nickname
    .split(" ")
    .map(name => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const hasRichContent = (message: any): boolean => {
  return (
    message.richContent &&
    typeof message.richContent === "object" &&
    message.richContent.content &&
    Array.isArray(message.richContent.content)
  );
};

export const isValidTipTapContent = (content: JSONContent): boolean => {
  if (!content || typeof content !== "object") return false;
  if (!content.type || content.type !== "doc") return false;
  if (!Array.isArray(content.content)) return false;
  return true;
};
