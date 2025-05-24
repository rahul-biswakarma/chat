"use client";

import React, { useRef } from "react";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent,useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { SocketMessageTypes } from "teleparty-websocket-lib";

import { useChatContext } from "@/components/context/chat.context";
import { Button } from "@/components/ui/button";

interface TipTapEditorProps {
  onTypingStart: () => void;
  onTypingStop: () => void;
}

export default function TipTapEditor({
  onTypingStart,
  onTypingStop,
}: TipTapEditorProps) {
  const { client } = useChatContext();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: "text-foreground",
          },
        },
      }),
      Placeholder.configure({
        placeholder: "Type your message...",
        emptyEditorClass: "text-muted-foreground",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none text-foreground placeholder:text-muted-foreground min-h-[40px] max-h-[120px] overflow-y-auto p-3 bg-background border border-border rounded-md",
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getText().trim();
      if (content) {
        handleTypingStart();
      } else {
        handleTypingStop();
      }
    },
  });

  const handleTypingStart = () => {
    if (!client) return;

    client.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, {
      typing: true,
    });
    onTypingStart();

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      handleTypingStop();
    }, 3000);
  };

  const handleTypingStop = () => {
    if (!client) return;

    client.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, {
      typing: false,
    });
    onTypingStop();

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const sendMessage = () => {
    if (!client || !editor) return;

    const content = editor.getText().trim();
    if (!content) return;

    try {
      client.sendMessage(SocketMessageTypes.SEND_MESSAGE, {
        body: content,
      });
      editor.commands.clearContent();
      handleTypingStop();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message", {
        description: "Please try again",
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  if (!editor) {
    return null;
  }

  const hasContent = editor.getText().trim().length > 0;

  return (
    <div className="border-t border-border bg-card p-4">
      <div className="flex space-x-3 items-end">
        <div className="flex-1 relative" onKeyDown={handleKeyDown}>
          <EditorContent editor={editor} className="tiptap-editor" />
        </div>
        <Button
          onClick={sendMessage}
          disabled={!hasContent}
          size="sm"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
