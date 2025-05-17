import { useState } from "react";
import "./App.css";

const LANGUAGES = {
  en: "English",
  ht: "Kreyòl",
  es: "Español",
};

const PROMPTS = {
  en: [
    "Need help with rent or utility bills this month?",
    "Looking for food or shelter in Chambersburg?",
    "Where can I get help finding a job right now?",
    "I cold use help to stop drinking — is there a meeting today?",
  ],
  ht: [
    "Ki kote mwen ka jwenn èd ak lwaye oswa bòdwo sèvis?",
    "Ki kote mwen ka jwenn manje oswa abri?",
    "Ki moun ki ka ede m jwenn travay?",
    "Mwen bezwen èd pou m sispann bwè — èske gen reyinyon jodi a?",
  ],
  es: [
    "¿Dónde puedo encontrar ayuda con la renta o los servicios?",
    "¿Dónde puedo encontrar comida o refugio en Chambersburg?",
    "¿Dónde puedo conseguir un trabajo ahora?",
    "Necesito ayuda para dejar de beber — ¿hay una reunión hoy?",
  ],
};

function App() {
  const [language, setLanguage] = useState("en");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (msg) => {
  const newMessages = [...messages, { role: "user", content: msg }];
  setMessages(newMessages);
  setLoading(true);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ messages: newMessages })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.reply;
    setMessages([...newMessages, { role: "assistant", content: reply }]);
  } catch (error) {
    console.error("Error during fetch:", error);
    setMessages([
      ...newMessages,
      { role: "assistant", content: "Sorry, something went wrong." }
    ]);
  } finally {
    setLoading(false);
  }
};

    const data = await response.json();
    const reply = data.choices[0].message.content;
    setMessages([...newMessages, { role: "assistant", content: reply }]);
    setLoading(false);
  };

  return (
    <div className="app">
      <header>
        <h1>Chambersburg Digital Assistant</h1>
        <p>A multilingual community guide for Chambersburg, PA</p>
        <div className="language-toggle">
          {Object.entries(LANGUAGES).map(([code, label]) => (
            <button
              key={code}
              onClick={() => setLanguage(code)}
              className={language === code ? "active" : ""}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <section className="prompt-buttons">
        {PROMPTS[language].map((text, idx) => (
          <button key={idx} onClick={() => sendMessage(text)}>
            {text}
          </button>
        ))}
      </section>

      <section className="chat">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong> {msg.content}
          </div>
        ))}
        {loading && <div className="message assistant">Assistant is typing...</div>}
      </section>

      <footer>
        <input
          type="text"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
        />
        <button onClick={() => sendMessage(input)}>Send</button>
      </footer>
    </div>
  );
}

export default App;
