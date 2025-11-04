'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { generateAIResponse, extractMemory } from '@/lib/ai';
import { Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { emotions } from '@/lib/personalities';

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = useStore((state) => state.messages);
  const user = useStore((state) => state.user);
  const currentEmotion = useStore((state) => state.currentEmotion);
  const addMessage = useStore((state) => state.addMessage);
  const addMemory = useStore((state) => state.addMemory);
  const setEmotion = useStore((state) => state.setEmotion);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message
    addMessage({
      role: 'user',
      content: userMessage,
    });

    // Extract and save memory
    const memory = extractMemory(userMessage);
    if (memory) {
      addMemory(memory);
    }

    try {
      // Generate AI response
      const conversationHistory = messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const { response, emotion } = await generateAIResponse(
        userMessage,
        user.preferences.companionPersonality,
        user.name,
        user.memories,
        conversationHistory
      );

      // Update emotion
      setEmotion(emotion);

      // Add AI response
      setTimeout(() => {
        addMessage({
          role: 'assistant',
          content: response,
          emotion,
        });
        setIsLoading(false);
      }, 1000); // Simulate typing delay
    } catch (error) {
      console.error('Error generating response:', error);
      addMessage({
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again!",
      });
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentEmotionData = emotions.find((e) => e.id === currentEmotion);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg border-b border-gray-700 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="text-4xl animate-pulse">
              {currentEmotionData?.emoji || '😊'}
            </div>
            <div>
              <h2 className="font-semibold text-lg">Your AI Companion</h2>
              <p className="text-sm text-gray-400">
                Feeling {currentEmotionData?.label || 'Happy'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-2xl font-semibold mb-2 gradient-text">
                Start Your Journey
              </h3>
              <p className="text-gray-400">
                Say hello to your AI companion and begin a meaningful conversation!
              </p>
            </div>
          )}

          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-primary-600 to-pink-600 text-white'
                      : 'bg-gray-800 text-white'
                  }`}
                >
                  {message.role === 'assistant' && message.emotion && (
                    <div className="text-2xl mb-1">
                      {emotions.find((e) => e.id === message.emotion)?.emoji}
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === 'user'
                        ? 'text-pink-200'
                        : 'text-gray-500'
                    }`}
                  >
                    {format(new Date(message.timestamp), 'HH:mm')}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-gray-800 rounded-2xl px-4 py-3">
                <Loader2 className="animate-spin text-primary-500" size={20} />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg border-t border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-gray-700 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-primary-600 to-pink-600 rounded-full p-3 hover:from-primary-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
