import { createRouter, createWebHistory } from "vue-router";
import TeamStats from "../views/TeamStats.vue";
import BestGoalkeepers from "../views/BestGoalkeepers.vue";
import BestDefenders from "../views/BestDefenders.vue";
import BestMidfielders from "../views/BestMidfielders.vue";
import BestStrikers from "../views/BestStrikers.vue";
import TransferAssistant from "../views/TransferAssistant.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "teamStats",
      component: TeamStats,
    },
    {
      path: "/best-goalkeepers",
      name: "bestGoalkeepers",
      component: BestGoalkeepers,
    },
    {
      path: "/best-defenders",
      name: "bestDefenders",
      component: BestDefenders,
    },
    {
      path: "/best-midfielders",
      name: "bestMidfielders",
      component: BestMidfielders,
    },
    {
      path: "/best-strikers",
      name: "bestStrikers",
      component: BestStrikers,
    },
    {
      path: "/transfer-assistant",
      name: "transferAssistant",
      component: TransferAssistant,
    },
  ],
});

export default router;
