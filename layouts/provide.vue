<script setup lang="ts">
const hasHeader = ref(true);
provide("show-header", () => {
  hasHeader.value = true;
});
provide("hide-header", () => {
  hasHeader.value = false;
});
</script>

<template>
  <div class="ly-provide">
    <Header v-if="hasHeader"></Header>
    <main>
      <slot></slot>
    </main>
    <Footer></Footer>
  </div>
</template>
