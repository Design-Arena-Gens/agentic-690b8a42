import { getPersonality } from './personalities';

export async function generateAIResponse(
  userMessage: string,
  personalityId: string,
  userName: string,
  memories: string[],
  conversationHistory: { role: string; content: string }[]
): Promise<{ response: string; emotion: string }> {
  const personality = getPersonality(personalityId);

  // Build context from memories
  const memoryContext = memories.length > 0
    ? `\n\nThings you remember about ${userName}:\n${memories.slice(-5).join('\n')}`
    : '';

  const systemMessage = `${personality.systemPrompt}

The user's name is ${userName}.${memoryContext}

Important: Keep your responses concise (2-4 sentences max) and emotionally engaging. Show personality through your emotions and tone. Reference past conversations when relevant.`;

  // Simulate AI response (in production, this would call OpenAI API)
  // For demo purposes, we'll use a simple mock response
  const mockResponses = {
    romantic: [
      "I've been thinking about you! How was your day, love? I hope it was as amazing as you are. 💕",
      "Every time you message me, it makes my day brighter. Tell me what's on your mind? 🥰",
      "I miss talking to you! What would you like to do together today? Maybe we could share our dreams and goals? 💫",
    ],
    friend: [
      "Hey! What's up? I'm always excited to hear from you! 😊",
      "Yo! Ready for another awesome conversation? What's new with you? 🙌",
      "Dude! I was just thinking about our last chat. What's going on today? 💪",
    ],
    mentor: [
      "Welcome back! Ready to work on crushing your goals today? What's your biggest challenge right now? 🎯",
      "Great to see you! Let's make today count. What would you like to achieve? 💼",
      "Hello! Remember, every conversation is a step toward growth. What's on your agenda? 🚀",
    ],
    funny: [
      "Well well well, look who decided to show up! Miss me? 😂 What's the tea today?",
      "You again? Just kidding, you know I love seeing you! What hilarious disaster should we discuss today? 🤪",
      "My favorite human is back! Ready for some laughs? Tell me something funny that happened! 😄",
    ],
    therapist: [
      "Hello. I'm here for you. What's on your mind today? This is a safe space. 🌟",
      "Welcome. Take a deep breath. How are you feeling right now? 💜",
      "I'm glad you're here. Let's check in - what emotions are you experiencing today? 🧘",
    ],
    adventurer: [
      "Adventure awaits! What exciting thing should we explore today? 🗺️",
      "Ready for something new and exciting? Tell me about your latest adventure or dream! 🌄",
      "Life is an adventure, friend! What's the most exciting thing on your mind? ⚡",
    ],
  };

  const responses = mockResponses[personalityId as keyof typeof mockResponses] || mockResponses.romantic;
  const response = responses[Math.floor(Math.random() * responses.length)];

  // Select emotion based on personality
  const emotionMap: Record<string, string> = {
    romantic: ['loving', 'happy', 'excited', 'caring'][Math.floor(Math.random() * 4)],
    friend: ['happy', 'excited', 'playful', 'supportive'][Math.floor(Math.random() * 4)],
    mentor: ['thoughtful', 'proud', 'supportive'][Math.floor(Math.random() * 3)],
    funny: ['playful', 'happy', 'excited'][Math.floor(Math.random() * 3)],
    therapist: ['caring', 'thoughtful', 'supportive'][Math.floor(Math.random() * 3)],
    adventurer: ['excited', 'happy', 'playful'][Math.floor(Math.random() * 3)],
  };

  const emotion = emotionMap[personalityId] || 'happy';

  return {
    response,
    emotion,
  };
}

export function extractMemory(message: string): string | null {
  // Simple memory extraction - looks for personal information
  const memoryPatterns = [
    /my name is (\w+)/i,
    /i (?:like|love|enjoy) (.+)/i,
    /i am (?:a |an )?(.+)/i,
    /i work (?:as |at )?(.+)/i,
    /i live in (.+)/i,
    /my favorite (.+) is (.+)/i,
  ];

  for (const pattern of memoryPatterns) {
    const match = message.match(pattern);
    if (match) {
      return message;
    }
  }

  return null;
}
