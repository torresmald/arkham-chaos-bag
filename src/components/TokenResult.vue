<template>
  <div v-if="token" class="my-6 flex items-center justify-center">
    <div class="perspective-distant h-[120px] w-[120px]">
      <div
        class="rotate-y-180 relative h-full w-full transform-3d"
        :class="{ 'token-drawing': store.isDrawing, 'token-revealed': !store.isDrawing }"
      >
        <div
          class="backface-hidden z-2 absolute inset-0 flex items-center justify-center rounded-full bg-white text-2xl font-bold shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
          :class="{ 'token-reveal': !store.isDrawing }"
        >
          <img
            v-if="store.isDrawing ? token.image.back : token.image.front"
            :src="store.isDrawing ? token.image.back : token.image.front"
            class="h-[100px] w-[100px] rounded-full border-2 border-[#aaa] bg-white object-contain"
            :alt="token.image.back ? 'Token Back' : 'Token Front'"
          />
          <span v-else>{{ token.type }}</span>
        </div>
        <div
          class="backface-hidden z-1 rotate-y-180 absolute inset-0 flex items-center justify-center rounded-full bg-[#eee] text-2xl font-bold shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
        >
          <img
            v-if="token.image.back"
            :src="token.image.back"
            class="h-[100px] w-[100px] rounded-full border-2 border-[#aaa] bg-white object-contain"
            alt="Token Back"
          />
          <span v-else>?</span>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="my-6 flex items-center justify-center">
    <div class="perspective-distant h-[120px] w-[120px]">
      <div
        class="rotate-y-180 relative h-full w-full transform-3d"
      >
        <div
          class="z-2 absolute inset-0 flex items-center justify-center rounded-full bg-white text-2xl font-bold shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
        >
          <img
           
            src="/src/assets/back.webp"
            class="h-[100px] w-[100px] rounded-full border-2 border-[#aaa] bg-white object-contain"
            alt="Token Back"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChaosBagStore } from "../stores/bag/chaos";
import type { Token } from "../types/token";

const store = useChaosBagStore();

const { token } = defineProps<{
  token: Token | null;
}>();
</script>

<style>

.token-drawing {
  animation: draw-token-spin 3s linear forwards;
  will-change: transform;
}

.token-revealed {
  transform: rotateY(0deg);
  transition: transform 280ms ease-out;
}

.token-reveal {
  animation: reveal-front 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
@keyframes draw-token-spin {
  0% {
    transform: rotateY(180deg) scale(0.50);
  }
  25% {
    transform: rotateY(405deg) scale(0.65);
  }
  50% {
    transform: rotateY(630deg) scale(0.85);
  }
  75% {
    transform: rotateY(855deg) scale(0.95);
  }
  100% {
    transform: rotateY(1080deg) scale(1);
  }
}
@keyframes reveal-front {
  0% {
    transform: translateY(8px) scale(0.88);
    filter: brightness(0.8);
  }
  70% {
    transform: translateY(-2px) scale(1.03);
    filter: brightness(1.06);
  }
  100% {
    transform: translateY(0) scale(1);
    filter: brightness(1);
  }
}

</style>
