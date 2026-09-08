/**
 * HealthPoint Fitness - Real-Time Audible Voice Coach
 * Wraps the Web Speech API (speechSynthesis) with strict throttling,
 * anti-spam interval locks, and punchy athletic coaching phrases.
 */

class VoiceCoach {
  constructor() {
    this.isMuted = false;
    this.lastSpokenTimestamp = 0;
    this.minIntervalMs = 2800; // Minimum interval between speech cues to avoid spam
    this.lastSpokenText = '';
    this.synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (muted && this.synth) {
      this.synth.cancel();
    }
  }

  toggleMute() {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  speak(text, priority = false) {
    if (this.isMuted || !this.synth || !text) return;

    const now = Date.now();
    const timeSinceLast = now - this.lastSpokenTimestamp;

    // Throttle non-priority cues if spoken too recently
    if (!priority && timeSinceLast < this.minIntervalMs) {
      return;
    }

    // Do not repeat identical cue consecutively within 4 seconds
    if (this.lastSpokenText === text && timeSinceLast < 4000) {
      return;
    }

    try {
      this.synth.cancel(); // Cancel any ongoing backlog
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05; // Energetic, snappy pace
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Select natural English voice if available
      const voices = this.synth.getVoices();
      const preferredVoice = voices.find(v => (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      this.synth.speak(utterance);
      this.lastSpokenTimestamp = now;
      this.lastSpokenText = text;
    } catch (err) {
      console.warn('VoiceCoach speech synthesis failed', err);
    }
  }

  speakRepCount(count) {
    const praise = count % 5 === 0 ? `Rep ${count}, great work!` : `${count}`;
    this.speak(praise, true);
  }

  cancel() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const voiceCoach = new VoiceCoach();
export default voiceCoach;
