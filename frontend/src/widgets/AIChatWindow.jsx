import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Mic, Volume2, Bot } from 'lucide-react';
import { useAI } from '../context/AIContext';
import { useSpeech } from '../hooks/useSpeech';
import AIMessage from './AIMessage';
import QuickActionChips from './QuickActionChips';

const AIChatWindow = ({ catalogProducts = [], userOrders = [] }) => {
  const { messages, setIsAiOpen, loading, sendMessage } = useAI();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const { isListening, speechSupported, startListening, speakText } = useSpeech((transcript) => {
    setInput(transcript);
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      const text = input;
      setInput('');
      sendMessage(text, catalogProducts, userOrders);
    }
  };

  const handleChipSelect = (chipText) => {
    sendMessage(chipText, catalogProducts, userOrders);
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-white border border-slate-200 shadow-2xl rounded-2xl flex flex-col overflow-hidden text-slate-800">
      {/* Chat Window Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 border-b border-indigo-700 flex items-center justify-between text-white shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shadow">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>AI Shopping Assistant</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </h3>
            <p className="text-[10px] text-indigo-100">Powered by MERN & AI Action Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => speakText(messages[messages.length - 1]?.text || '')}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
            title="Listen to last AI response"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsAiOpen(false)}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-slate-50 scrollbar-thin">
        {messages.map((msg) => (
          <AIMessage key={msg.id} msg={msg} />
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-indigo-600 p-2 italic font-semibold">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>AI is analyzing catalog & preferences...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Shortcuts */}
      <div className="border-t border-slate-200 bg-white px-2">
        <QuickActionChips onSelectChip={handleChipSelect} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        {speechSupported && (
          <button
            type="button"
            onClick={startListening}
            className={`p-2 rounded-full transition ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600 hover:text-indigo-600'
            }`}
            title="Voice Commands (Microphone)"
          >
            <Mic className="w-4 h-4" />
          </button>
        )}

        <input
          type="text"
          placeholder="Ask AI: 'Laptops under ₹60,000'..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-slate-100 border border-slate-200 rounded-full py-2 px-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
        />

        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white flex items-center justify-center transition shadow shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default AIChatWindow;
