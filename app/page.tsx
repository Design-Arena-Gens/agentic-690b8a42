'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import ChatInterface from '@/components/ChatInterface';
import Sidebar from '@/components/Sidebar';
import OnboardingModal from '@/components/OnboardingModal';
import PremiumModal from '@/components/PremiumModal';
import { Menu, X } from 'lucide-react';

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useStore((state) => state.user);
  const updateStreak = useStore((state) => state.updateStreak);

  useEffect(() => {
    // Check if first time user
    if (!user.lastActive) {
      setShowOnboarding(true);
    }

    // Update streak on app open
    updateStreak();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="flex h-screen overflow-hidden">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar */}
        <div
          className={`
            fixed md:relative inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          <Sidebar onOpenPremium={() => setShowPremium(true)} />
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col">
          <ChatInterface />
        </div>
      </div>

      {/* Modals */}
      {showOnboarding && (
        <OnboardingModal onClose={() => setShowOnboarding(false)} />
      )}
      {showPremium && (
        <PremiumModal onClose={() => setShowPremium(false)} />
      )}
    </main>
  );
}
