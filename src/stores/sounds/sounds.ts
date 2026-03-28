import successSound from "../../assets/sounds/success.mp3";
import failSound from "../../assets/sounds/fail.mp3";
import shuffleSound from "../../assets/sounds/shuffle.mp3";
import { defineStore } from "pinia";
import { useChaosBagStore } from "../bag/chaos";
const voiceId = "zAgdErjrxjfLDAiVdEij";
const elevenlabsApiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
export const useSoundsStore = defineStore('sounds', {
    state: () => ({
        success: new Audio(successSound) as HTMLAudioElement,
        fail: new Audio(failSound) as HTMLAudioElement,
        shuffle: new Audio(shuffleSound) as HTMLAudioElement,
        disableAudio: false,
        volume: 0.7,
        speechCache: new Map<string, string>(),
    }),
    actions: {
        applyVolume() {
            const effectiveVolume = this.disableAudio ? 0 : this.volume;
            this.success.volume = effectiveVolume;
            this.fail.volume = effectiveVolume;
            this.shuffle.volume = effectiveVolume;
        },
        play(sound: HTMLAudioElement) {
            if (this.disableAudio) return;
            this.applyVolume();
            sound.currentTime = 0;
            sound.play();
        },
        toggleAudio() {
            this.disableAudio = !this.disableAudio;
            this.applyVolume();
        },
        setVolume(value: number) {
            this.volume = Math.min(1, Math.max(0, value));
            this.applyVolume();
        },
        stop(sound: HTMLAudioElement) {
            sound.pause();
            sound.currentTime = 0;
        },
        async handleDraw() {
            const store = useChaosBagStore();
            if (store.isDrawing || store.bag.length === 0) return;
            try {
                this.shuffle.loop = true;
                this.play(this.shuffle);
                const result = await store.drawToken();
                this.shuffle.pause();
                this.shuffle.currentTime = 0;

                if (result?.type === "success") {
                    this.play(this.success);
                } else if (result?.type === "fail") {
                    this.play(this.fail);
                }
            } catch {
                this.shuffle.pause();
                this.shuffle.currentTime = 0;
            }

        },
        stopAll() {
            this.stop(this.shuffle);
            this.stop(this.success);
            this.stop(this.fail);
        },
        async speak(text: string) {
            try {
                if (this.disableAudio) return;
                this.applyVolume();

                const cachedAudioUrl = this.speechCache.get(text);
                if (cachedAudioUrl) {
                    const cachedAudio = new Audio(cachedAudioUrl);
                    cachedAudio.volume = this.volume;
                    await cachedAudio.play();
                    this.speechCache.set(text, cachedAudioUrl);
                    return;
                }

                const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'audio/mpeg',
                        'Content-Type': 'application/json',
                        'xi-api-key': elevenlabsApiKey,
                    },
                    body: JSON.stringify({
                        text: text,
                        voice_id: voiceId,
                    }),
                });
                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);
                this.speechCache.set(text, audioUrl);
                const audio = new Audio(audioUrl);
                audio.volume = this.volume;
                await audio.play();
            } catch (error) {
                console.error(error);
            }

        }
    },
});