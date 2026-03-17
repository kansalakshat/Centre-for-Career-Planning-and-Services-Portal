import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import api from "../api/api";
import Sidebar from "../components/Sidebar";

function ChatPage() {

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const textareaRef = useRef(null);
  const { receiverId } = useParams();
  const token = localStorage.getItem("ccps-token");
  const { authUser } = useAuthContext();
  const messagesEndRef = useRef(null);

  /* Fetch messages */
  const fetchMessages = async () => {
    try {
      const res = await api.get(`/api/messages/${receiverId}`);
      setMessages(res.data);

    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetchMessages();

    const interval = setInterval(() => {
      fetchMessages();
    }, 3000); // refresh every 3 seconds

    return () => clearInterval(interval);
  }, [receiverId]);

  /* Send message */
  const handleSendMessage = async () => {
    if (!text.trim()) return;

    try {
      await api.post("/api/messages/send", {
        receiverId,
        text
      });

      setText("");
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // Reset height
      }
      fetchMessages();

    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    // Auto resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-3rem)]">
          <h1 className="text-2xl font-semibold mb-4 text-[#13665b]">
            Chat
          </h1>

          {/* Messages container - fills remaining space and pushes input to bottom */}
          <div className="flex-1 border rounded-xl p-4 overflow-y-auto mb-4 bg-white shadow-sm flex flex-col gap-3">

            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                No messages yet. Say hi!
              </div>
            ) : (
              messages.map((msg) => {

                const isMe = msg.senderId !== receiverId;
                const time = new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                });

                return (
                  <div
                    key={msg._id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"} mb-2`}
                  >

                    <div
                      className={`px-4 py-2.5 rounded-2xl max-w-[70%] shadow-sm ${isMe
                          ? "bg-[#13665b] text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                        }`}
                    >
                      <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.text}</p>

                      <p className={`text-[10px] mt-1.5 text-right ${isMe ? "text-teal-100" : "text-gray-400"}`}>
                        {time}
                      </p>
                    </div>

                  </div>
                );
              })
            )}

            <div ref={messagesEndRef}></div>

          </div>

          {/* Input area - fixed at bottom */}
          <div className="bg-white p-3 rounded-xl border shadow-sm flex items-end gap-3 transition-all duration-200">

            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 bg-transparent resize-none outline-hidden p-2 max-h-[120px] min-h-[44px]"
              rows={1}
            />

            <button
              onClick={handleSendMessage}
              disabled={!text.trim()}
              className="bg-[#13665b] text-white p-3 rounded-xl hover:bg-teal-700 transition items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mb-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default ChatPage;