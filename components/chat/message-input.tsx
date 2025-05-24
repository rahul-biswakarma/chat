import React, { useState } from "react";

import TipTapEditor from "@/components/chat/tiptap-editor";

export default function MessageInput() {
  const [isTyping, setIsTyping] = useState(false);

  const handleTypingStart = () => {
    setIsTyping(true);
  };

  const handleTypingStop = () => {
    setIsTyping(false);
  };

  return (
    <TipTapEditor
      onTypingStart={handleTypingStart}
      onTypingStop={handleTypingStop}
    />
  );
}
