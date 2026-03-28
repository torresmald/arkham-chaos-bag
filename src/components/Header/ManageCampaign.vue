<template>
  <button
    class="rounded-lg border border-indigo-700 px-3 py-1.5 text-xs text-indigo-300 transition hover:border-indigo-500 hover:text-indigo-100"
    @click="openCampaignManager"
  >
    Campaña
  </button>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const openCampaignManager = () => {
  router.push("/campaign");
};
</script>
