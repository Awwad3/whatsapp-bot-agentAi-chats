const voiceResponses: Record<string, string> = {
  greeting: 'https://example.com/audio/greeting.mp3',
  thanks: 'https://example.com/audio/thanks.mp3',
};

export function chooseVoiceMessage(text: string): string | null {
  if (text.toLowerCase().includes('مرحبا')) return voiceResponses.greeting;
  if (text.includes('شكرا')) return voiceResponses.thanks;
  return null;
}
