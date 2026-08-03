import React from 'react';
import { Sparkles, Bot, X } from 'lucide-react';
import { useAI } from '../context/AIContext';
import AIChatWindow from './AIChatWindow';

const FloatingAI = ({ catalogProducts = [], userOrders = [] }) => {
  const { isAiOpen, setIsAiOpen } = useAI();

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsAiOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 floating-ai-btn w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-transform"
        title="Open Floating AI Shopping Assistant"
      >
        {isAiOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative flex items-center justify-center">
            <Bot className="w-7 h-7 text-white" />
            <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1 animate-bounce" />
          </div>
        )}
      </button>

      {/* Chat Window Modal */}
      {isAiOpen && <AIChatWindow catalogProducts={catalogProducts} userOrders={userOrders} />}
    </>
  );
};

export default FloatingAI;
