let audioContext = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

function playCompleteSound() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const notes = [523.25, 659.25, 783.99, 1046.50];

  notes.forEach((freq, index) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, now + index * 0.12);

    gainNode.gain.setValueAtTime(0, now + index * 0.12);
    gainNode.gain.linearRampToValueAtTime(0.3, now + index * 0.12 + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + index * 0.12 + 0.5);

    oscillator.start(now + index * 0.12);
    oscillator.stop(now + index * 0.12 + 0.5);
  });
}

function playAddSound() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(440, now);
  oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.15);

  gainNode.gain.setValueAtTime(0.2, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

  oscillator.start(now);
  oscillator.stop(now + 0.3);
}

function playDeleteSound() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(600, now);
  oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.2);

  gainNode.gain.setValueAtTime(0.15, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

  oscillator.start(now);
  oscillator.stop(now + 0.25);
}

export { playCompleteSound, playAddSound, playDeleteSound };
