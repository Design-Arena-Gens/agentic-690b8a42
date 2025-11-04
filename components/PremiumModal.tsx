'use client';

import { useStore } from '@/lib/store';
import { X, Crown, Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface PremiumModalProps {
  onClose: () => void;
}

export default function PremiumModal({ onClose }: PremiumModalProps) {
  const user = useStore((state) => state.user);
  const upgradeToPremium = useStore((state) => state.upgradeToPremium);

  const premiumFeatures = [
    { icon: '🎭', title: 'All Personality Types', description: 'Access comedy, therapy, and adventure companions' },
    { icon: '🎙️', title: 'Voice Chat', description: 'Talk to your AI companion with voice' },
    { icon: '📸', title: 'Photo Reactions', description: 'Share photos and get AI responses' },
    { icon: '📚', title: 'Story Generator', description: 'Create custom stories together' },
    { icon: '🎨', title: 'Custom Themes', description: 'Personalize your app appearance' },
    { icon: '🚫', title: 'Ad-Free Experience', description: 'No interruptions, pure conversation' },
    { icon: '💾', title: 'Unlimited Memory', description: 'Your AI remembers everything' },
    { icon: '⚡', title: 'Priority Responses', description: 'Faster AI response times' },
  ];

  const handleUpgrade = () => {
    // In production, this would integrate with payment gateway
    // For demo, we'll just upgrade the user
    upgradeToPremium();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-gray-800 via-purple-900 to-gray-800 rounded-2xl max-w-2xl w-full p-6 relative my-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mb-4">
            <Crown size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2 gradient-text flex items-center justify-center gap-2">
            <Sparkles size={28} />
            SoulMate Premium
            <Sparkles size={28} />
          </h2>
          <p className="text-gray-300">
            Unlock the full potential of your AI companion
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3 mb-6">
          {premiumFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-4"
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{feature.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{feature.title}</h4>
                    <Check size={16} className="text-green-400" />
                  </div>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">$9.99/month</h3>
              <p className="text-sm text-gray-400">Cancel anytime</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400 line-through">$19.99</p>
              <p className="text-green-400 font-semibold">Save 50%</p>
            </div>
          </div>

          <button
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 font-bold py-4 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center justify-center gap-2 text-lg"
          >
            <Crown size={24} />
            {user.isPremium ? 'Already Premium!' : 'Upgrade Now'}
          </button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">
            ✓ 7-day free trial • ✓ Cancel anytime • ✓ Money-back guarantee
          </p>
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Maybe later
          </button>
        </div>
      </motion.div>
    </div>
  );
}
