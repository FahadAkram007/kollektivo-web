/**
 * Short two-tone sound when a printed-QR payment arrives, so the cashier notices it.
 * Browsers only allow sound after the first tap on the page; before that it stays silent.
 */
export function playChime(): void {
  try {
    const audio = new AudioContext();
    [880, 1320].forEach((frequency, index) => {
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.2, audio.currentTime + index * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + index * 0.15 + 0.3);
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start(audio.currentTime + index * 0.15);
      oscillator.stop(audio.currentTime + index * 0.15 + 0.3);
    });
    setTimeout(() => void audio.close(), 1000);
  } catch {
    // No audio available: the payment is still shown on screen.
  }
}
