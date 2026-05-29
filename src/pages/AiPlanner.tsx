import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, RotateCcw } from "lucide-react";
import GlassCard from "../components/GlassCard";
import { apiRequest } from "../lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTER_PROMPTS = [
  "What should I prioritize 6 months before the wedding?",
  "Help me create a realistic $15,000 wedding budget.",
  "What questions should I ask a wedding photographer?",
  "How many tables do I need for 80 guests?",
];

export default function AiPlanner() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm WedGuru, your personal wedding planning assistant. Ask me anything — timelines, budgets, vendor tips, seating, or whatever's on your mind. How can I help today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || isLoading) {
      return;
    }

    const userMessage: Message = { role: "user", content };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);
    setError("");

    try {
      const data = await apiRequest<{ reply: string }>("/ai/chat", {
        method: "POST",
        bodyData: { messages: nextMessages.slice(-20) },
      });
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  function resetChat() {
    setMessages([
      {
        role: "assistant",
        content: "Fresh start! What would you like to plan?",
      },
    ]);
    setError("");
  }

  return (
    <section style={{ display: "grid", gap: 14, maxWidth: 780, margin: "0 auto" }}>
      <GlassCard>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={20} style={{ color: "var(--color-blush)" }} />
            <h1 className="page-title" style={{ margin: 0 }}>
              AI Planner
            </h1>
          </div>
          <button className="btn btn-muted" type="button" onClick={resetChat} title="Reset conversation" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
        <p className="muted-label" style={{ marginTop: 6 }}>
          Powered by Llama 3.3 via Groq. Ask about timelines, budgets, vendors, and more.
        </p>
      </GlassCard>

      <div
        className="glass"
        style={{
          padding: "1rem",
          minHeight: 400,
          maxHeight: "60vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "80%",
                background: msg.role === "user" ? "var(--color-blush)" : "rgba(255,255,255,0.7)",
                color: msg.role === "user" ? "#fff" : "inherit",
                borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                padding: "0.7rem 1rem",
                fontSize: "0.92rem",
                lineHeight: 1.55,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {msg.content}
            </motion.article>
          ))}
        </AnimatePresence>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ alignSelf: "flex-start", display: "flex", gap: 4, padding: "0.7rem 1rem", background: "rgba(255,255,255,0.7)", borderRadius: "16px 16px 16px 4px" }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--color-blush)", display: "block" }}
              />
            ))}
          </motion.div>
        ) : null}

        {error ? (
          <p style={{ color: "#b42318", fontSize: "0.88rem", alignSelf: "center" }}>{error}</p>
        ) : null}

        <div ref={bottomRef} />
      </div>

      {messages.length === 1 ? (
        <GlassCard title="Try asking">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {STARTER_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                className="btn btn-muted"
                type="button"
                onClick={() => void sendMessage(prompt)}
                style={{ fontSize: "0.85rem", textAlign: "left" }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </GlassCard>
      ) : null}

      <div className="glass" style={{ padding: "0.75rem", display: "flex", gap: 8, alignItems: "flex-end" }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask WedGuru anything... (Enter to send, Shift+Enter for new line)"
          rows={2}
          disabled={isLoading}
          style={{
            flex: 1,
            resize: "none",
            padding: "0.6rem 0.8rem",
            borderRadius: 10,
            border: "1px solid rgba(200,149,110,0.3)",
            background: "rgba(255,255,255,0.8)",
            fontFamily: "inherit",
            fontSize: "0.92rem",
          }}
        />
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => void sendMessage()}
          disabled={isLoading || !input.trim()}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "0.65rem 1rem" }}
        >
          <Send size={16} />
          Send
        </button>
      </div>
    </section>
  );
}
