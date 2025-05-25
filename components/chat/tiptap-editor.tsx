"use client";

import React from "react";

import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Code,
  Italic,
  List,
  ListOrdered,
  Send,
  Strikethrough,
} from "lucide-react";
import { toast } from "sonner";
import { SocketMessageTypes } from "teleparty-websocket-lib";

import LinkDialog from "@/components/chat/link-dialog";
import { useChatContext } from "@/components/context/chat.context";
import { Button } from "@/components/ui/button";

interface TipTapEditorProps {
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  readonly?: boolean;
  content?: JSONContent;
  fallbackText?: string;
  className?: string;
}

export default function TipTapEditor({
  onTypingStart,
  onTypingStop,
  readonly = false,
  content,
  fallbackText,
  className,
}: TipTapEditorProps) {
  const { client } = useChatContext();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        code: {
          HTMLAttributes: {
            class: "text-green-500 bg-green-500/10 p-1 rounded-md",
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: readonly ? "text-card-foreground" : "text-foreground",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: readonly ? "list-disc pl-6 my-2" : "list-disc pl-6 my-2",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: readonly
              ? "list-decimal pl-6 my-2"
              : "list-decimal pl-6 my-2",
          },
        },
        listItem: {
          HTMLAttributes: {
            class: readonly ? "my-1" : "my-1",
          },
        },
      }),
      Link.configure({
        openOnClick: readonly,
        HTMLAttributes: {
          class: readonly
            ? "text-primary underline hover:text-primary/80"
            : "text-blue-500 underline",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      ...(readonly
        ? []
        : [
            Placeholder.configure({
              placeholder: "Send a message",
              emptyEditorClass: "text-muted-foreground",
            }),
          ]),
    ],
    content: readonly ? content : "",
    editable: !readonly,
    editorProps: {
      attributes: {
        class: readonly
          ? `prose prose-sm max-w-none text-card-foreground rich-message-content ${className || ""}`
          : "prose prose-sm max-w-none focus:outline-none text-foreground placeholder:text-muted-foreground min-h-[40px] max-h-[120px] overflow-y-auto p-3",
      },
      handleKeyDown: readonly
        ? undefined
        : (view, event) => {
            if (event.key === "Enter" && event.shiftKey) {
              event.preventDefault();
              sendMessage();
              return true;
            }
            return false;
          },
    },
    onUpdate: readonly
      ? undefined
      : ({ editor }) => {
          const content = editor.getText().trim();
          if (content) {
            onTypingStart?.();
          } else {
            onTypingStop?.();
          }
        },
  });

  const sendMessage = () => {
    if (!client || !editor || readonly) return;

    const content = editor.getText().trim();
    if (!content) return;

    try {
      const richContent = JSON.stringify(editor.getJSON());

      client.sendMessage(SocketMessageTypes.SEND_MESSAGE, {
        body: richContent,
      });
      editor.commands.clearContent();
      onTypingStop?.();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message", {
        description: "Please try again",
      });
    }
  };

  const handleAddLink = (url: string) => {
    if (editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  if (!editor) {
    if (readonly && fallbackText) {
      return (
        <p className="text-card-foreground text-sm whitespace-pre-wrap break-words">
          {fallbackText}
        </p>
      );
    }
    return null;
  }

  if (readonly) {
    return <EditorContent editor={editor} />;
  }

  const hasContent = editor.getText().trim().length > 0;

  return (
    <div className="px-4">
      <div className="bg-card/80 border border-border rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center gap-1 p-2 pb-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`h-8 w-8 p-0 ${editor.isActive("bold") ? "bg-accent" : ""}`}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`h-8 w-8 p-0 ${editor.isActive("italic") ? "bg-accent" : ""}`}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`h-8 w-8 p-0 ${editor.isActive("strike") ? "bg-accent" : ""}`}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`h-8 w-8 p-0 ${editor.isActive("code") ? "bg-accent" : ""}`}
          >
            <Code className="h-4 w-4" />
          </Button>
          <LinkDialog
            onAddLink={handleAddLink}
            isActive={editor.isActive("link")}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`h-8 w-8 p-0 ${editor.isActive("bulletList") ? "bg-accent" : ""}`}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`h-8 w-8 p-0 ${editor.isActive("orderedList") ? "bg-accent" : ""}`}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        <div>
          <EditorContent
            editor={editor}
            className="tiptap-editor min-h-[80px]"
          />
        </div>

        <div className="flex items-center justify-end p-2 pt-0">
          <div className="flex items-center gap-2">
            <Button
              onClick={sendMessage}
              disabled={!hasContent}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 w-8 p-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
