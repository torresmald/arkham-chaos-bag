import successSound from "../../assets/sounds/success.mp3";
import failSound from "../../assets/sounds/fail.mp3";
import shuffleSound from "../../assets/sounds/shuffle.mp3";
import { defineStore } from "pinia";
import { useChaosBagStore } from "../bag/chaos";
export const useSoundsStore = defineStore('sounds', {
    state: () => ({
        success: new Audio(successSound) as HTMLAudioElement,
        fail: new Audio(failSound) as HTMLAudioElement,
        shuffle: new Audio(shuffleSound) as HTMLAudioElement,
        disableAudio: false,
        volume: 0.7,
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
        }
    },
});