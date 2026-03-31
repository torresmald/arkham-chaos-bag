<template>
  <main class="min-h-dvh bg-slate-950 text-slate-100">
    <header
      class="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur"
    >
      <div class="mx-auto flex w-full max-w-md items-center justify-between">
        <button
          class="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-200 transition hover:border-slate-500 hover:text-white"
          @click="goBack"
        >
          Bolsa
        </button>
        <h1 class="text-sm font-semibold tracking-tight">Gestionar campaña</h1>
        <span class="w-[60px]" />
      </div>
    </header>

    <section class="mx-auto w-full max-w-md p-4">
      <div class="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
        <CurrentCampaignData v-if="campaignStore.isSelectedCampaign" />

        <CampaignSelector />

        <button
          class="mt-4 w-full rounded-lg border border-rose-700 bg-rose-900/20 px-3 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-900/40"
          @click="resetApp"
        >
          Reset app
        </button>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import CampaignSelector from "../components/CampaignSelector.vue";
import CurrentCampaignData from "../components/Campaign/CurrentCampaignData.vue";
import { useChaosBagStore } from "../stores/bag/chaos";
import { useCampaignStore } from "../stores/campaign/campaign";

const router = useRouter();
const bagStore = useChaosBagStore();
const campaignStore = useCampaignStore();

onMounted(async () => {
  if (campaignStore.campaigns.length === 0) {
    await campaignStore.loadCampaigns();
  }
});

const goBack = () => {
  router.push("/");
};

const resetApp = () => {
  bagStore.reset();
  campaignStore.resetSelectedCampaign();
};
</script>
