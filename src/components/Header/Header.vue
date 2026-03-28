<template>
  <header
    class="relative z-40 overflow-visible border-b border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur"
  >
    <div class="mx-auto flex w-full max-w-md items-center justify-between">
      <h1 class="text-lg font-semibold tracking-tight">Arkham Chaos Bag</h1>
      <div class="flex items-center gap-2">
        <ManageCampaign />
        <Audio />
      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
import Audio from "./Audio.vue";
import ManageCampaign from "./ManageCampaign.vue";
</script>
