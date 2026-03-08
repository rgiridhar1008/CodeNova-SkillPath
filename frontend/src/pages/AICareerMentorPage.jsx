import { useState } from "react";
import { SendHorizonal } from "lucide-react";
import Layout from "../components/Layout";
import { askMentor } from "../api/client";

export default function AICareerMentorPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "I am your AI career mentor. Ask about skills, roadmap, interviews, or resume." }
  ]);

  const send = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => prev.concat(userMessage));
    setInput("");
    try {
      const reply = await askMentor(userMessage.content);
      setMessages((prev) => prev.concat({ role: "assistant", content: reply }));
    } catch {
      setMessages((prev) =>
        prev.concat({
          role: "assistant",
          content: "I am temporarily unavailable. Please try again in a moment."
        })
      );
    }
  };

  return (
    <Layout>
      <section className="glass-card rounded-3xl p-6">
        <h1 className="font-heading text-3xl font-bold">AI Career Mentor</h1>
        <p className="text-sm text-[var(--muted)]">
          Personal mentor chat for career guidance, interview prep, and learning plans.
        </p>
        <div className="mt-4 h-[55vh] space-y-3 overflow-auto rounded-2xl border border-white/25 bg-white/45 p-4 dark:bg-white/5">
          {messages.map((message, idx) => (
            <div
              key={`${message.role}-${idx}`}
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                message.role === "user"
                  ? "ml-auto bg-[var(--brand)] text-white"
                  : "bg-white/75 text-[var(--text)] dark:bg-white/10"
              }`}
            >
              {message.content}
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            className="w-full rounded-xl border border-white/25 bg-white/70 px-3 py-3 outline-none dark:bg-white/5"
            placeholder="Ask: How do I prepare for AI Engineer interviews?"
          />
          <button onClick={send} className="rounded-xl bg-[var(--brand)] px-4 text-white">
            <SendHorizonal size={16} />
          </button>
        </div>
      </section>
    </Layout>
  );
}
