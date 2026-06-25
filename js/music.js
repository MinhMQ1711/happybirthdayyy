/* ============================================
   MUSIC.JS - Happy Birthday with INFINITE LOOP
   ============================================ */

class BirthdayMusic {
    constructor() {
        this.audioCtx = null;
        this.isPlaying = false;
        this.gainNode = null;
        this.masterGain = 0.3;
        this.loopTimeout = null;
        this.currentOscillators = [];

        // Happy Birthday melody - Key of C major
        this.melody = [
            // "Happy birthday to you"
            { note: 'C4', duration: 0.75 },
            { note: 'C4', duration: 0.25 },
            { note: 'D4', duration: 1 },
            { note: 'C4', duration: 1 },
            { note: 'F4', duration: 1 },
            { note: 'E4', duration: 2 },
            { pause: 0.5 },

            // "Happy birthday to you"
            { note: 'C4', duration: 0.75 },
            { note: 'C4', duration: 0.25 },
            { note: 'D4', duration: 1 },
            { note: 'C4', duration: 1 },
            { note: 'G4', duration: 1 },
            { note: 'F4', duration: 2 },
            { pause: 0.5 },

            // "Happy birthday dear Quang Duy"
            { note: 'C4', duration: 0.75 },
            { note: 'C4', duration: 0.25 },
            { note: 'C5', duration: 1 },
            { note: 'A4', duration: 1 },
            { note: 'F4', duration: 1 },
            { note: 'E4', duration: 1 },
            { note: 'D4', duration: 2 },
            { pause: 0.5 },

            // "Happy birthday to you"
            { note: 'Bb4', duration: 0.75 },
            { note: 'Bb4', duration: 0.25 },
            { note: 'A4', duration: 1 },
            { note: 'F4', duration: 1 },
            { note: 'G4', duration: 1 },
            { note: 'F4', duration: 2 },
            { pause: 1.5 }, // Khoảng nghỉ trước khi loop
        ];

        this.noteFreqs = {
            'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
            'G4': 392.00, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
            'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46,
        };

        // Bass line đơn giản để nhạc phong phú hơn
        this.bassLine = [
            { note: 'C3', duration: 4 },
            { note: 'C3', duration: 4 },
            { note: 'F3', duration: 4 },
            { note: 'C3', duration: 2 },
            { note: 'G3', duration: 2 },
            { note: 'F3', duration: 4 },
        ];

        this.bassFreqs = {
            'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61,
            'G3': 196.00, 'A3': 220.00, 'Bb3': 233.08,
        };
    }

    init() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) {
                console.warn('Web Audio API không được hỗ trợ');
                return false;
            }
            this.audioCtx = new AudioContext();

            // Master gain
            this.gainNode = this.audioCtx.createGain();
            this.gainNode.gain.value = 0;
            this.gainNode.connect(this.audioCtx.destination);

            // Fade in master
            this.gainNode.gain.linearRampToValueAtTime(
                this.masterGain,
                this.audioCtx.currentTime + 1
            );
        }
        return true;
    }

    // Phát một note với âm thanh piano-like
    playNote(frequency, startTime, duration, type = 'triangle', volume = 0.5) {
        if (!this.audioCtx) return;

        const osc = this.audioCtx.createOscillator();
        const noteGain = this.audioCtx.createGain();

        osc.type = type;
        osc.frequency.value = frequency;

        // ADSR Envelope
        const attack = 0.02;
        const decay = 0.1;
        const sustain = volume * 0.6;
        const release = 0.3;

        noteGain.gain.setValueAtTime(0, startTime);
        noteGain.gain.linearRampToValueAtTime(volume, startTime + attack);
        noteGain.gain.linearRampToValueAtTime(sustain, startTime + attack + decay);
        noteGain.gain.setValueAtTime(sustain, startTime + duration - release);
        noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(noteGain);
        noteGain.connect(this.gainNode);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.1);

        this.currentOscillators.push(osc);

        // Harmonic nhẹ cho âm thanh phong phú
        if (type === 'triangle') {
            const osc2 = this.audioCtx.createOscillator();
            const noteGain2 = this.audioCtx.createGain();
            osc2.type = 'sine';
            osc2.frequency.value = frequency * 2;
            noteGain2.gain.setValueAtTime(0, startTime);
            noteGain2.gain.linearRampToValueAtTime(volume * 0.15, startTime + attack);
            noteGain2.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
            osc2.connect(noteGain2);
            noteGain2.connect(this.gainNode);
            osc2.start(startTime);
            osc2.stop(startTime + duration + 0.1);
            this.currentOscillators.push(osc2);
        }
    }

    // Tính tổng thời gian của melody
    getTotalDuration() {
        const tempo = 0.5; // seconds per beat
        return this.melody.reduce((sum, item) => {
            const dur = (item.duration || item.pause || 0) * tempo;
            return sum + dur;
        }, 0);
    }

    // Phát melody 1 lần
    playMelodyOnce() {
        if (!this.audioCtx) return 0;

        const tempo = 0.5;
        let currentTime = this.audioCtx.currentTime + 0.1;

        this.melody.forEach(item => {
            if (item.pause) {
                currentTime += item.pause * tempo;
                return;
            }
            const freq = this.noteFreqs[item.note];
            const duration = item.duration * tempo;
            if (freq) {
                this.playNote(freq, currentTime, duration * 0.95, 'triangle', 0.5);
            }
            currentTime += duration;
        });

        return currentTime - this.audioCtx.currentTime;
    }

    // PHÁT VÀ LOOP VÔ HẠN
    play() {
        if (this.isPlaying) return;
        if (!this.init()) return;

        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }

        this.isPlaying = true;
        this.scheduleLoop();
    }

    // Schedule loop: phát xong lại phát lại
    scheduleLoop() {
        if (!this.isPlaying) return;

        const duration = this.playMelodyOnce();
        const durationMs = duration * 1000;

        // Schedule lần phát tiếp theo
        this.loopTimeout = setTimeout(() => {
            if (this.isPlaying) {
                this.scheduleLoop();
            }
        }, durationMs);
    }

    stop() {
        this.isPlaying = false;

        if (this.loopTimeout) {
            clearTimeout(this.loopTimeout);
            this.loopTimeout = null;
        }

        // Fade out
        if (this.gainNode && this.audioCtx) {
            this.gainNode.gain.cancelScheduledValues(this.audioCtx.currentTime);
            this.gainNode.gain.setValueAtTime(
                this.gainNode.gain.value,
                this.audioCtx.currentTime
            );
            this.gainNode.gain.linearRampToValueAtTime(
                0,
                this.audioCtx.currentTime + 0.5
            );
        }
    }

    // Tạm dừng (pause)
    pause() {
        this.stop();
    }

    // Resume sau khi pause
    resume() {
        if (!this.isPlaying) {
            this.play();
        }
    }

    setVolume(value) {
        this.masterGain = Math.max(0, Math.min(1, value));
        if (this.gainNode && this.audioCtx) {
            this.gainNode.gain.linearRampToValueAtTime(
                this.masterGain,
                this.audioCtx.currentTime + 0.1
            );
        }
    }

    // Kiểm tra trạng thái
    isCurrentlyPlaying() {
        return this.isPlaying;
    }
}

window.BirthdayMusic = BirthdayMusic;