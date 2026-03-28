import { createRouter, createWebHistory } from "vue-router";
import ChaosBagView from "../views/ChaosBagView.vue";
import CampaignManagerView from "../views/CampaignManagerView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: ChaosBagView,
    },
    {
      path: "/campaign",
      name: "campaign-manager",
      component: CampaignManagerView,
    },
  ],
});

export default router;
