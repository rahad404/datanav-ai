"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Send, Bot, User, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { chatApi } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import type { ChatMessage } from "@/lib/types";

function extractReportId(pathname: string): string | undefined {
  return pathname.match(/^\/reports\/([^/]+)/)?.[1];
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 px-4 py-2">
      <div className="flex size-8 items-center justify-center rounded-full bg-muted">
        <Bot className="size-4 text-muted-foreground" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-2.5">
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:0ms]" />
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex items-start gap-3 px-4 py-2 ${isUser ? "flex-row-reverse" : ""}`}>
      <Avatar className="size-8 shrink-0 rounded-full">
        {isUser ? (
          <>
            <AvatarImage src="" />
            <AvatarFallback className="bg-emerald-600/10 text-emerald-600 dark:text-emerald-400">
              <User className="size-4" />
            </AvatarFallback>
          </>
        ) : (
          <AvatarFallback className="bg-muted">
            <Bot className="size-4 text-muted-foreground" />
          </AvatarFallback>
        )}
      </Avatar>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-emerald-600 text-white"
            : "bg-muted text-foreground"
        }`}
      >
        {msg.content}
      </div>
    </div>
  );
}

const DEFAULT_SUGGESTIONS = [
  "What can DataNav AI do?",
  "How do I upload a file?",
  "What file formats are supported?",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);
  const [hasFetchedHistory, setHasFetchedHistory] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const { data: session } = useSession();

  const reportId = extractReportId(pathname);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when sheet opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  // Fetch history when sheet opens
  useEffect(() => {
    if (!open || !session || hasFetchedHistory) return;

    chatApi
      .history()
      .then((history) => {
        if (history && history.length > 0) {
          setMessages(history);
        }
        setHasFetchedHistory(true);
      })
      .catch(() => {
        // Silently fail — history is optional
        setHasFetchedHistory(true);
      });
  }, [open, session, hasFetchedHistory]);

  // Fetch suggestions when report context changes
  useEffect(() => {
    if (!session) return;
    setSuggestions(DEFAULT_SUGGESTIONS);

    if (reportId) {
      chatApi
        .suggestions(reportId)
        .then((res) => {
          if (res.suggestions && res.suggestions.length > 0) {
            setSuggestions(res.suggestions);
          }
        })
        .catch(() => {});
    }
  }, [reportId, session]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !session) return;

      const userMsg: ChatMessage = {
        _id: `temp-${Date.now()}`,
        userId: session.user.id,
        role: "user",
        content: content.trim(),
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);

      try {
        const res = await chatApi.send({
          message: content.trim(),
          reportId,
          route: pathname,
        });

        const assistantMsg: ChatMessage = {
          _id: `temp-${Date.now() + 1}`,
          userId: session.user.id,
          role: "assistant",
          content: res.reply,
          suggestions: res.suggestions,
          createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMsg]);

        if (res.suggestions && res.suggestions.length > 0) {
          setSuggestions(res.suggestions);
        }
      } catch (err) {
        const errorMsg: ChatMessage = {
          _id: `temp-${Date.now() + 2}`,
          userId: session.user.id,
          role: "assistant",
          content: "Sorry, I couldn't process that. Please try again.",
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [session, reportId, pathname]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleSuggestionClick(suggestion: string) {
    sendMessage(suggestion);
  }

  async function handleClearHistory() {
    try {
      await chatApi.clearHistory();
      setMessages([]);
      setSuggestions(DEFAULT_SUGGESTIONS);
      toast.success("Chat history cleared");
    } catch {
      toast.error("Failed to clear history");
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-700 hover:scale-105 active:scale-95"
        aria-label="Open chat assistant"
      >
        <MessageCircle className="size-6" />
      </button>

      {/* Chat sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex w-full max-w-md flex-col p-0">
          <SheetHeader className="border-b border-border px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400">
                  <Bot className="size-4" />
                </div>
                <SheetTitle className="text-base">AI Assistant</SheetTitle>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={handleClearHistory}
                    title="Clear history"
                  >
                    <Trash2 className="size-4 text-muted-foreground" />
                  </Button>
                )}
              </div>
            </div>
          </SheetHeader>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto py-4">
            {!session ? (
              <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                <Bot className="size-12 text-muted-foreground/40 mb-4" />
                <p className="text-sm text-muted-foreground">
                  Sign in to use the AI assistant
                </p>
              </div>
            ) : messages.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                <Bot className="size-12 text-emerald-600/30 mb-4" />
                <p className="text-sm font-medium mb-1">Ask me anything</p>
                <p className="text-xs text-muted-foreground mb-6 max-w-xs">
                  I can help you understand your data, navigate the app, or answer questions
                  about your reports.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(s)}
                      className="rounded-full border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <MessageBubble key={msg._id} msg={msg} />
                ))}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />

                {/* Suggestions after last assistant message */}
                {!isLoading && suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 px-4 pt-4">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(s)}
                        className="rounded-full border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Input */}
          {session && (
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-border px-4 py-3"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={isLoading}
                className="h-10 flex-1 rounded-full border-muted-foreground/20 bg-muted/50 pl-4"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="size-10 shrink-0 rounded-full bg-emerald-600 hover:bg-emerald-700"
              >
                <Send className="size-4" />
              </Button>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
