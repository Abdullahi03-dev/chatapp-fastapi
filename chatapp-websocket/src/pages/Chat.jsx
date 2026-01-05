// src/pages/Chat.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Code2, Gamepad2, Send, Menu, X } from "lucide-react";
import api from "../api"; // axios instance, baseURL set
import toast from "react-hot-toast";

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
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // image upload loading state
  const [isUploading, setIsUploading] = useState(false);
  
  // connection status
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);

  const backend = import.meta.env.VITE_API_URL || "https://chatapp-fastapi-6pg7.onrender.com";
  const wsBackend = import.meta.env.VITE_WS_URL || "wss://chatapp-fastapi-6pg7.onrender.com";

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

  // WebSocket setup with auto-retry
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;
    let retryTimeout = null;
    let pingInterval = null;

    // close previous socket if any
    if (ws.current) {
      try { ws.current.close(); } catch (e) {}
    }

    setIsConnecting(true);
    setIsConnected(false);

    const connectWebSocket = async () => {
      console.log(`Attempting WebSocket connection (attempt ${retryCount + 1})...`);
      
      // Wake up the server first with an HTTP request
      try {
        console.log("Waking up server...");
        await fetch(`${backend}/`);
        console.log("Server is awake");
      } catch (e) {
        console.log("Wake up request failed, trying WebSocket anyway...");
      }

      const socket = new WebSocket(`${wsBackend}/chat/ws/${activeRoom}`);
      ws.current = socket;

      socket.onopen = () => {
        console.log("WS connected to", activeRoom);
        setIsConnected(true);
        setIsConnecting(false);
        retryCount = 0; // reset on successful connection
        
        // Start ping keepalive every 25 seconds to prevent Render timeout
        pingInterval = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "ping" }));
            console.log("Ping sent");
          }
        }, 25000);
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // Ignore pong responses
        if (data.type === "pong") return;
        setMessages((prev) => [...prev, { ...data, isOwn: data.user === username }]);
      };

      socket.onclose = (e) => {
        console.log("WS closed", e.code, e.reason);
        setIsConnected(false);
        if (pingInterval) clearInterval(pingInterval);
        
        // Auto-retry if not intentionally closed
        if (retryCount < maxRetries) {
          retryCount++;
          const delay = Math.min(1000 * retryCount, 5000); // 1s, 2s, 3s, 4s, 5s
          console.log(`Retrying in ${delay}ms...`);
          setIsConnecting(true);
          retryTimeout = setTimeout(connectWebSocket, delay);
        } else {
          setIsConnecting(false);
        }
      };

      socket.onerror = (err) => {
        console.log("WS error", err);
      };
    };

    connectWebSocket();

    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
      if (pingInterval) clearInterval(pingInterval);
      if (ws.current) {
        ws.current.onclose = null; // prevent retry on intentional close
        ws.current.close();
      }
    };
  }, [activeRoom, username, wsBackend, backend]);

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
    setIsUploading(true);
    toast.loading("Uploading image...", { id: "upload" });

    try {
      const res = await api.post("/upload/media", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data.url;
      ws.current.send(JSON.stringify({ user: username, content: url, type: "image" }));
      toast.success("Image sent!", { id: "upload" });
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Image upload failed", { id: "upload" });
    } finally {
      setIsUploading(false);
      e.target.value = ""; // reset input
    }
  };

  // AUDIO RECORDING & UPLOAD
  const startRecording = async () => {
    if (!navigator.mediaDevices) {
      toast.error("Recording not supported on this browser");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      audioChunksRef.current = [];

      mr.ondataavailable = (ev) => {
        if (ev.data.size > 0) audioChunksRef.current.push(ev.data);
      };

      mr.onstop = async () => {
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
        
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const file = new File([blob], `voice-${Date.now()}.webm`, { type: "audio/webm" });
        const fd = new FormData();
        fd.append("file", file);

        toast.loading("Sending audio...", { id: "audio-upload" });
        try {
          const res = await api.post("/upload/media", fd, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          const url = res.data.url;
          ws.current.send(JSON.stringify({ user: username, content: url, type: "audio" }));
          toast.success("Audio sent!", { id: "audio-upload" });
        } catch (err) {
          console.error("Audio upload failed", err);
          toast.error("Audio upload failed", { id: "audio-upload" });
        }
      };

      mr.start();
      setIsRecording(true);
      toast.success("Recording started...");
    } catch (err) {
      console.error("Microphone access denied", err);
      toast.error("Microphone access denied");
    }
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
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
      
      {/* LEFT SIDEBAR */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="p-4 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#f37925]">Rooms</h2>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="md:hidden p-1 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-3 space-y-2 overflow-y-auto h-[calc(100vh-64px)]">
          {rooms.map((room) => {
            const Icon = room.icon;
            return (
              <button
                key={room.id}
                onClick={() => {
                  setActiveRoom(room.id);
                  setSidebarOpen(false);
                }}
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
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 sm:h-16 border-b border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center px-3 sm:px-6 justify-between shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <currentRoom.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#f37925]" />
            <h1 className="text-base sm:text-lg font-bold truncate">{currentRoom.name}</h1>
            {/* Connection status */}
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : isConnecting ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`} title={isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Disconnected'} />
          </div>
          <div className="text-xs sm:text-sm text-gray-600 hidden sm:block">Signed in as <b>{username}</b></div>
        </header>

        {/* MESSAGES */}
        <div className="flex-1 px-3 py-3 sm:p-4 overflow-y-auto flex flex-col">
          {/* Connection status banner */}
          {!isConnected && !isConnecting && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-3 text-center text-sm">
              <p>Disconnected from server. The server might be waking up.</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 bg-red-500 text-white px-4 py-1 rounded-full text-xs hover:bg-red-600"
              >
                Retry Connection
              </button>
            </div>
          )}
          {isConnecting && (
            <div className="bg-yellow-100 text-yellow-700 px-4 py-3 rounded-lg mb-3 text-center text-sm">
              <p>Connecting to server... (may take ~30s if server is sleeping)</p>
            </div>
          )}
          {messages.length === 0 && isConnected && (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.isOwn ? "justify-end" : "justify-start"} mb-2`}
            >
              <div
                className={`px-3 py-2 max-w-[85%] sm:max-w-[75%] rounded-2xl ${
                  msg.isOwn
                    ? "bg-[#f37925] text-white rounded-br-sm"
                    : "bg-gray-200 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 rounded-bl-sm"
                }`}
              >
                <p className="text-xs sm:text-sm font-semibold mb-1">{msg.isOwn ? "You" : msg.user}</p>

                {/* Render by type */}
                {msg.type === "image" && (
                  <img src={msg.content} alt="sent" className="max-w-[150px] sm:max-w-[200px] md:max-w-[280px] rounded-md" />
                )}

                {msg.type === "audio" && (
                  <audio controls src={msg.content} className="w-36 sm:w-48 h-10" />
                )}

                {(!msg.type || msg.type === "text") && <p className="text-sm sm:text-base break-words">{msg.content}</p>}

                <p className="text-[10px] sm:text-xs opacity-70 mt-1 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT + MEDIA UPLOAD */}
        <form onSubmit={sendText} className="p-2 sm:p-4 border-t border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shrink-0">
          <div className="flex gap-1.5 sm:gap-2 max-w-4xl mx-auto w-full items-center">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 min-w-0 rounded-full border px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-50 dark:bg-neutral-700 focus:ring-2 focus:ring-[#f37925] focus:outline-none"
            />

            {/* Image input */}
            <label className="shrink-0 rounded-full bg-gray-100 dark:bg-neutral-700 p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors">
              <input type="file" accept="image/*" onChange={handleImageSelected} className="hidden" />
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M21 15V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M3 19c0 1.054.895 2 2 2h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M8.5 11.5l2.5 3.01L14.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            </label>

            {/* Audio record button */}
            {!isRecording ? (
              <button 
                type="button" 
                onClick={startRecording} 
                className="shrink-0 rounded-full bg-gray-100 dark:bg-neutral-700 p-2 hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors"
                title="Record audio"
              >
                <span className="text-lg">🎤</span>
              </button>
            ) : (
              <button 
                type="button" 
                onClick={stopRecording} 
                className="shrink-0 rounded-full bg-red-500 text-white p-2 animate-pulse"
                title="Stop recording"
              >
                <span className="text-lg">⏹️</span>
              </button>
            )}

            <button type="submit" className="shrink-0 rounded-full bg-[#f37925] hover:bg-[#e06820] text-white p-2.5 sm:p-3 transition-colors">
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
