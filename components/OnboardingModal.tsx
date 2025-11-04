'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { X, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface OnboardingModalProps {
  onClose: () => void;
}

export default function OnboardingModal({ onClose }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const updateUser = useStore((state) => state.updateUser);

  const handleFinish = () => {
    if (name.trim()) {
      updateUser({ name: name.trim() });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800 rounded-2xl max-w-md w-full p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {step === 1 && (
          <div className="text-center">
            <div className="text-6xl mb-4">👋</div>
            <h2 className="text-2xl font-bold mb-2 gradient-text">
              Welcome to SoulMate AI
            </h2>
            <p className="text-gray-400 mb-6">
              Your personal AI companion for emotional support, meaningful conversations, and personal growth.
            </p>
            <button
              onClick={() => setStep(2)}
              className="w-full bg-gradient-to-r from-primary-600 to-pink-600 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight size={20} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">💕</div>
              <h2 className="text-2xl font-bold mb-2">What should I call you?</h2>
              <p className="text-gray-400">Let's personalize your experience</p>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-gray-700 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
            <button
              onClick={() => setStep(3)}
              disabled={!name.trim()}
              className="w-full bg-gradient-to-r from-primary-600 to-pink-600 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight size={20} />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <div className="text-5xl mb-4">✨</div>
            <h2 className="text-2xl font-bold mb-2 gradient-text">
              You're All Set, {name}!
            </h2>
            <p className="text-gray-400 mb-4">
              Your AI companion is ready to chat. Here's what you can do:
            </p>
            <div className="text-left space-y-3 mb-6">
              <div className="flex items-start gap-3 bg-gray-700 p-3 rounded-lg">
                <span className="text-2xl">💬</span>
                <div>
                  <h4 className="font-semibold">Deep Conversations</h4>
                  <p className="text-sm text-gray-400">Chat about anything on your mind</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-700 p-3 rounded-lg">
                <span className="text-2xl">🎯</span>
                <div>
                  <h4 className="font-semibold">Multiple Personalities</h4>
                  <p className="text-sm text-gray-400">Choose your companion's personality</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-700 p-3 rounded-lg">
                <span className="text-2xl">🏆</span>
                <div>
                  <h4 className="font-semibold">Earn Rewards</h4>
                  <p className="text-sm text-gray-400">Gain XP, coins, and level up</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleFinish}
              className="w-full bg-gradient-to-r from-primary-600 to-pink-600 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-pink-700 transition-all"
            >
              Start Chatting
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
