import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("llama3.2"); // Default model
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]);
  const chatWindowRef = useRef<HTMLDivElement>(null); // Ref for chat window
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prevMessages) => [
      ...prevMessages,
      { user: userMessage, bot: "Bot is typing..." }, // Keep the typing indicator
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/inference/${selectedModel}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input_data: userMessage }),
        }
      );
      const data = await response.json();
      setMessages((prevMessages) =>
        prevMessages.map((msg, index) =>
          index === prevMessages.length - 1
            ? { ...msg, bot: data.output } // Update with actual response
            : msg
        )
      );
    } catch (error) {
      console.error("Error during inference:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to the bottom of the chat window
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="App">
      <h1>Jooney's LLM Chat Interface</h1>
      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <div className="user-message">User: {msg.user}</div>
            <div className="bot-message">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {msg.bot}
              </ReactMarkdown>
              {isLoading && index === messages.length - 1 && (
                <div className="loading-spinner"></div>
              )}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          <option value="llama3.2">Llama 3.2</option>
          <option value="llama3.1:8b">Llama 3.1:8b</option>
        </select>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
