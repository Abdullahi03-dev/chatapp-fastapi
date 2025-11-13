// src/pages/Chat.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Code2, Gamepad2, Send } from "lucide-react";
import api from "../api"; // axios instance, baseURL set

const rooms = [
  { id: "General", name: "General", icon: MessageSquare },
  { id: "Frontend", name: "Frontend", icon: Code2 },
  { id: "Backend", name: "Backend", icon: Code2 },
];

export default function Chat() {
  const [activeRoom, setActiveRoom] = useState("General");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const username = localStorage.getItem("user") || "You";
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  // audio recording state
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);

  const backend = "http://127.0.0.1:8000";

  // Fetch history when room changes
  useEffect(() => {
    fetch(`${backend}/chat/rooms/${activeRoom}/messages`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((m) => ({ ...m, isOwn: m.user === username }));
        setMessages(formatted);
      })
      .catch(console.error);
  }, [activeRoom, username]);

  // WebSocket setup
  useEffect(() => {
    // close previous socket if any
    if (ws.current) {
      try { ws.current.close(); } catch (e) {}
    }

    const socket = new WebSocket(`ws://127.0.0.1:8000/chat/ws/${activeRoom}`);
    ws.current = socket;

    socket.onopen = () => console.log("WS connected to", activeRoom);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, { ...data, isOwn: data.user === username }]);
    };

    socket.onclose = () => console.log("WS closed");

    socket.onerror = (err) => console.log("WS error", err);

    return () => {
      socket.close();
    };
  }, [activeRoom, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendText = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const payload = { user: username, content: text.trim(), type: "text" };
    ws.current.send(JSON.stringify(payload));
    setText("");
  };

  // IMAGE UPLOAD: call backend upload endpoint, then send url via ws
  const handleImageSelected = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await api.post("/upload/media", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data.url;
      ws.current.send(JSON.stringify({ user: username, content: url, type: "image" }));
    } catch (err) {
      console.error("Upload failed", err);
      alert("Image upload failed");
    } finally {
      e.target.value = ""; // reset input
    }
  };

  // AUDIO RECORDING & UPLOAD
  const startRecording = async () => {
    if (!navigator.mediaDevices) {
      alert("Recording not supported on this browser");
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);
    mediaRecorderRef.current = mr;
    audioChunksRef.current = [];

    mr.ondataavailable = (ev) => {
      if (ev.data.size > 0) audioChunksRef.current.push(ev.data);
    };

    mr.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const file = new File([blob], `voice-${Date.now()}.webm`, { type: "audio/webm" });
      const fd = new FormData();
      fd.append("file", file);

      try {
        const res = await api.post("/upload/media", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const url = res.data.url;
        ws.current.send(JSON.stringify({ user: username, content: url, type: "audio" }));
      } catch (err) {
        console.error("Audio upload failed", err);
        alert("Audio upload failed");
      }
    };

    mr.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    const mr = mediaRecorderRef.current;
    if (!mr) return;
    mr.stop();
    setIsRecording(false);
  };

  const currentRoom = rooms.find((r) => r.id === activeRoom);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700">
        <div className="p-4 border-b border-gray-200 dark:border-neutral-700">
          <h2 className="text-xl font-bold text-[#f37925]">Rooms</h2>
        </div>
        <div className="p-3 space-y-2 overflow-y-auto h-[calc(100vh-64px)]">
          {rooms.map((room) => {
            const Icon = room.icon;
            return (
              <button
                key={room.id}
                onClick={() => setActiveRoom(room.id)}
                className={`flex items-center gap-3 p-3 rounded-lg w-full ${
                  activeRoom === room.id
                    ? "bg-[#f37925] text-white"
                    : "hover:bg-gray-100 dark:hover:bg-neutral-700"
                }`}
              >
                <Icon className="w-5 h-5" />
                {room.name}
              </button>
            );
          })}
        </div>
      </aside>

      {/* CHAT SECTION */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center px-6 justify-between">
          <div className="flex items-center gap-3">
            <currentRoom.icon className="w-6 h-6 text-[#f37925]" />
            <h1 className="ml-3 text-lg font-bold">{currentRoom.name}</h1>
          </div>
          <div className="text-sm text-gray-600">Signed in as <b>{username}</b></div>
        </header>

        {/* MESSAGES */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 mb-2 max-w-[75%] rounded-2xl ${
                  msg.isOwn
                    ? "bg-[#f37925] text-white rounded-br-sm"
                    : "bg-gray-200 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 rounded-bl-sm"
                }`}
              >
                <p className="text-sm font-semibold mb-1">{msg.isOwn ? "You" : msg.user}</p>

                {/* Render by type */}
                {msg.type === "image" && (
                  <img src={msg.content} alt="sent" className="max-w-full rounded-md" />
                )}

                {msg.type === "audio" && (
                  <audio controls src={msg.content} className="w-48" />
                )}

                {(!msg.type || msg.type === "text") && <p>{msg.content}</p>}

                <p className="text-xs opacity-70 mt-1 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT + MEDIA UPLOAD */}
        <form onSubmit={sendText} className="p-4 border-t border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
          <div className="flex gap-2 max-w-4xl mx-auto w-full items-center">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-full border px-4 py-2 bg-transparent focus:ring-2 focus:ring-[#f37925]"
            />

            {/* Image input */}
            <label className="rounded-full bg-white border p-2 cursor-pointer">
              <input type="file" accept="image/*" onChange={handleImageSelected} className="hidden" />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 15V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M3 19c0 1.054.895 2 2 2h14" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M8.5 11.5l2.5 3.01L14.5 11" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            </label>

            {/* Audio record controls */}
            {!isRecording ? (
              <button type="button" onClick={startRecording} className="rounded-full bg-white border p-2">Rec</button>
            ) : (
              <button type="button" onClick={stopRecording} className="rounded-full bg-red-500 text-white p-2">Stop</button>
            )}

            <button type="submit" className="rounded-full bg-[#f37925] text-white p-3">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
