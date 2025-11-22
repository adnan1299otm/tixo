
export const BANNED_WORDS = [
  'abuse', 'kill', 'sex', 'xxx', 'porn', 'nude', 'die', 'hate', 'stupid', 'idiot', 
  'drug', 'cocaine', 'weed', 'murder', 'suicide', 'naked', 'strip'
];

export const SafetyService = {
  checkContent: (text: string): { isSafe: boolean; reason?: string } => {
    const lowerText = text.toLowerCase();
    const foundWord = BANNED_WORDS.find(word => lowerText.includes(word));

    if (foundWord) {
      return {
        isSafe: false,
        reason: `⚠️ Content contains restricted language: "${foundWord}". Please keep Tixo safe.`
      };
    }

    return { isSafe: true };
  },

  // Simulates an image scan (since we can't do real AI image analysis on frontend only)
  scanMedia: async (file: File | string): Promise<{ isSafe: boolean }> => {
    // In a real app, this would call an AI endpoint (Gemini Vision).
    // For now, we approve all as we assume user meant well, but strictly warn in UI.
    return new Promise(resolve => {
      setTimeout(() => resolve({ isSafe: true }), 500);
    });
  }
};
