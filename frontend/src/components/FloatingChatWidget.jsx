import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { askMentor } from "../api/client";

const starterMessage = {
  role: "assistant",
  content: "Hi, I am SkillPath Assistant. Ask me about roadmap, resume, interviews, or placements.",
};

export default function FloatingChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([starterMessage]);
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const listRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
    }
  }, [open]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  const placeholder = useMemo(
    () => "Ask about your career roadmap, resume, or interview prep...",
    []
  );

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setInput("");
    setMessages((prev) => prev.concat({ role: "user", content: text }));

    try {
      setSending(true);
      const reply = await askMentor(text);
      setMessages((prev) => prev.concat({ role: "assistant", content: reply }));
      if (!open) setUnread((n) => n + 1);
    } catch {
      const fallback = "I am temporarily unavailable. Please try again in a moment.";
      setMessages((prev) => prev.concat({ role: "assistant", content: fallback }));
      if (!open) setUnread((n) => n + 1);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[70]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto mb-3 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-3xl border border-white/35 bg-[var(--panel)] shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-white">
              <div className="inline-flex items-center gap-2">
                <Bot size={18} />
                <div>
                  <p className="text-sm font-semibold">SkillPath Assistant</p>
                  <p className="text-[11px] text-white/85">AI Support</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg bg-white/20 p-1.5 transition hover:bg-white/30"
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>

            <div ref={listRef} className="h-72 overflow-auto px-3 py-3">
              <div className="space-y-2">
                {messages.map((message, idx) => (
                  <div
                    key={`${message.role}-${idx}`}
                    className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm ${
                      message.role === "user"
                        ? "ml-auto bg-[var(--brand)] text-white"
                        : "bg-white/75 text-[var(--text)] dark:bg-white/10"
                    }`}
                  >
                    {message.content}
                  </div>
                ))}
                {sending && (
                  <div className="max-w-[88%] rounded-2xl bg-white/75 px-3 py-2 text-sm text-[var(--muted)] dark:bg-white/10">
                    Typing...
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-white/25 p-3">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder={placeholder}
                  className="w-full rounded-xl border border-white/30 bg-white/75 px-3 py-2 text-sm outline-none dark:bg-white/10"
                />
                <button
                  onClick={sendMessage}
                  disabled={sending}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 p-2.5 text-white disabled:opacity-60"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto relative ml-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl transition hover:scale-[1.03]"
        aria-label="Open assistant chat"
      >
        <MessageCircle size={22} />
        {unread > 0 && !open && (
          <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
    </div>
  );
}
