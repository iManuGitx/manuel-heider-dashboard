import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";
import { User, Bot } from "lucide-react";

export function MessageThread({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="space-y-4">
      {messages.map((msg, i) => {
        const isUser = msg.role === "user";
        return (
          <div
            key={i}
            className={cn(
              "flex gap-3",
              isUser ? "flex-row" : "flex-row-reverse"
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                isUser
                  ? "bg-secondary"
                  : "bg-primary/10"
              )}
            >
              {isUser ? (
                <User className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Bot className="h-4 w-4 text-primary" />
              )}
            </div>
            <div
              className={cn(
                "max-w-[75%] rounded-lg px-4 py-3",
                isUser
                  ? "bg-secondary text-foreground"
                  : "bg-primary/10 text-foreground"
              )}
            >
              <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
              {msg.timestamp && (
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {new Date(msg.timestamp).toLocaleTimeString("de-DE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
