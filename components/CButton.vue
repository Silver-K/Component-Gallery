<script setup lang="ts">
const show = inject("show-header", () => {
  return;
});
const hide = inject("hide-header", () => {
  return;
});
const state = ref(true);
const toggle = () => {
  if (state.value) {
    hide();
  } else {
    show();
  }
  state.value = !state.value;
};
</script>

<template>
  <button @click="toggle">click</button>
</template>
