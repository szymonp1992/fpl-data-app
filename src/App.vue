<template>
  <div class="container">
    <div class="header-top">
      <RouterLink to="/">Team stats</RouterLink>
      <RouterLink to="/best-goalkeepers">Best Goalkeepers</RouterLink>
      <RouterLink to="/best-defenders">Best Defenders</RouterLink>
      <RouterLink to="/best-midfielders">Best Midfielders</RouterLink>
      <RouterLink to="/best-strikers">Best Strikers</RouterLink>
      <RouterLink to="/transfer-assistant">Transfer Asssistant</RouterLink>
    </div>
  </div>
  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>



<style>
div.header-top {
  display: flex;
  justify-content: space-around;
}
</style>

