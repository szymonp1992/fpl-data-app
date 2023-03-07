<template>
  <div>
    <RouterLink to="/">Fixture ticker</RouterLink>
    <RouterLink to="/">Free Hit Creator</RouterLink>
    <RouterLink to="/">Best Goalkeepers</RouterLink>
    <RouterLink to="/">Best Defenders</RouterLink>
    <RouterLink to="/">Best Midfielders</RouterLink>
    <RouterLink to="/">Best Strikers</RouterLink>
  </div>
  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<style scoped>
div {
  display: flex;
  justify-content: space-around;
}
</style>
