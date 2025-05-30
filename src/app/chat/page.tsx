'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperAirplaneIcon, UserIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { generateResponse } from '@/utils/api/openai';

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const systemMessage = {
  role: 'system' as const,
  content: `Sen MyBody Rules uygulamasının yapay zeka asistanısın. Kullanıcılara sağlıklı yaşam, beslenme ve fitness konularında yardımcı oluyorsun.
  Yanıtların kısa, öz ve Türkçe olmalı. Kullanıcının sağlık durumunu ve hedeflerini dikkate alarak kişiselleştirilmiş öneriler sunmalısın.`,
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: 'Merhaba! Size nasıl yardımcı olabilirim?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiMessages = [
        systemMessage,
        ...messages.map((msg) => ({
          role: msg.isUser ? ('user' as const) : ('assistant' as const),
          content: msg.content,
        })),
        { role: 'user' as const, content: input },
      ];

      const response = await generateResponse(apiMessages);

      const aiMessage: Message = {
        id: messages.length + 2,
        content: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: messages.length + 2,
        content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fitness-blue/5 via-fitness-green/5 to-fitness-orange/10 flex flex-col">
      <main className="flex flex-col flex-1 max-w-3xl mx-auto w-full shadow-xl rounded-2xl bg-white/90 dark:bg-neutral-900/90 mt-8 mb-8">
        {/* Başlık ve Açıklama */}
        <div className="px-6 pt-8 pb-4 border-b border-gray-100 dark:border-neutral-800 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-fitness-blue via-fitness-green to-fitness-orange bg-clip-text text-transparent mb-2">
            Yapay Zeka Sohbeti
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">
            Sağlık, beslenme ve fitness ile ilgili her şeyi sorabilirsin. MyBodyRules Asistanı 7/24
            yanında!
          </p>
        </div>
        {/* Mesaj Listesi */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 custom-scrollbar">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex w-full ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-end gap-2 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : ''}`}
                >
                  <div className="flex-shrink-0">
                    {message.isUser ? (
                      <div className="bg-fitness-blue text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                        <UserIcon className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="bg-fitness-green text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                        <SparklesIcon className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-md text-sm md:text-base whitespace-pre-wrap break-words ${
                      message.isUser
                        ? 'bg-fitness-blue text-white rounded-br-md'
                        : 'bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 rounded-bl-md'
                    }`}
                  >
                    {message.content}
                    <div className="text-xs opacity-50 mt-1 text-right">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start w-full"
            >
              <div className="flex items-end gap-2 max-w-[80%]">
                <div className="bg-fitness-green text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                  <SparklesIcon className="w-5 h-5" />
                </div>
                <div className="rounded-2xl px-4 py-3 shadow-md bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <div className="w-2 h-2 bg-fitness-green rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-fitness-green rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-fitness-green rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Mesaj Giriş Formu */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-gray-100 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 sticky bottom-0 z-10"
        >
          <div className="flex gap-3 items-center max-w-2xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Mesajınızı yazın..."
              className="flex-1 px-4 py-3 rounded-full border border-gray-200 dark:border-gray-700 focus:border-fitness-blue focus:ring-2 focus:ring-fitness-blue/30 transition bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 shadow-sm outline-none"
              disabled={isLoading}
              autoFocus
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading || !input.trim()}
              className="p-3 rounded-full bg-gradient-to-r from-fitness-blue via-fitness-green to-fitness-orange text-white shadow-lg transition-all duration-300 hover:opacity-90 disabled:opacity-60"
              aria-label="Gönder"
            >
              <PaperAirplaneIcon className="w-6 h-6 rotate-45" />
            </motion.button>
          </div>
        </form>
      </main>
    </div>
  );
}
