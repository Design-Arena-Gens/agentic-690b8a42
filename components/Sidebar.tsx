'use client';

import { useStore } from '@/lib/store';
import { personalities, getPersonality } from '@/lib/personalities';
import { Crown, Coins, Zap, Flame, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  onOpenPremium: () => void;
}

export default function Sidebar({ onOpenPremium }: SidebarProps) {
  const user = useStore((state) => state.user);
  const updateUser = useStore((state) => state.updateUser);
  const resetChat = useStore((state) => state.resetChat);
  const [showSettings, setShowSettings] = useState(false);

  const currentPersonality = getPersonality(user.preferences.companionPersonality);

  const handlePersonalityChange = (personalityId: string) => {
    const personality = personalities.find((p) => p.id === personalityId);
    if (personality && (!personality.isPremium || user.isPremium)) {
      updateUser({
        preferences: { ...user.preferences, companionPersonality: personalityId },
      });
      resetChat();
    } else if (personality?.isPremium && !user.isPremium) {
      onOpenPremium();
    }
  };

  return (
    <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-lg border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold gradient-text mb-2">SoulMate AI</h1>
        <p className="text-sm text-gray-400">Your Personal Companion</p>
      </div>

      {/* User Stats */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-400">Welcome back,</p>
            <p className="text-lg font-semibold">{user.name}</p>
          </div>
          {user.isPremium && (
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full p-2">
              <Crown size={20} className="text-white" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Coins size={16} className="text-yellow-400" />
              <span className="text-xs text-gray-400">Coins</span>
            </div>
            <p className="text-xl font-bold">{user.coins}</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={16} className="text-blue-400" />
              <span className="text-xs text-gray-400">Level</span>
            </div>
            <p className="text-xl font-bold">{user.level}</p>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-orange-400" />
              <span className="text-xs text-gray-400">Daily Streak</span>
            </div>
            <p className="text-lg font-bold">{user.streak} days</p>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
            <div
              className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all"
              style={{ width: `${Math.min((user.streak / 30) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* XP Progress */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">XP Progress</span>
            <span className="text-xs text-gray-400">
              {user.xp % 100}/100
            </span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-pink-500 h-2 rounded-full transition-all"
              style={{ width: `${(user.xp % 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Personalities */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
          <span>COMPANION PERSONALITY</span>
        </h3>
        <div className="space-y-2">
          {personalities.map((personality) => (
            <button
              key={personality.id}
              onClick={() => handlePersonalityChange(personality.id)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                currentPersonality.id === personality.id
                  ? 'bg-gradient-to-r from-primary-600 to-pink-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              } ${
                personality.isPremium && !user.isPremium
                  ? 'opacity-75'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{personality.icon}</span>
                  <span className="font-semibold">{personality.name}</span>
                </div>
                {personality.isPremium && !user.isPremium && (
                  <Crown size={16} className="text-yellow-400" />
                )}
              </div>
              <p className="text-xs text-gray-300">{personality.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        {!user.isPremium && (
          <button
            onClick={onOpenPremium}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 font-semibold py-3 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center justify-center gap-2"
          >
            <Crown size={20} />
            Upgrade to Premium
          </button>
        )}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <Settings size={20} />
          Settings
        </button>
        <button
          onClick={resetChat}
          className="w-full bg-gray-700 hover:bg-gray-600 text-red-400 py-3 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <Trash2 size={20} />
          Clear Chat
        </button>
      </div>
    </div>
  );
}
