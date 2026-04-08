<template>
  <div class="loader_wrapper">
    <div class="spinner" />
    <div
      v-if="message || $slots.default"
      :class="{ blinking }"
      class="loader_message"
    >
      <slot>{{ message }}</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string;
    blinking?: boolean;
  }>(),
  {
    blinking: true,
  }
);
</script>

<style scoped>
.loader_wrapper {
  display: inline-flex;
  align-items: center;
}

.spinner {
  width: 1em;
  height: 1em;
  border-width: 0.05em;
  border-radius: 100%;
  border-style: solid;
  border-color: currentColor transparent currentColor transparent;
  animation: spinner_rotation 1s linear infinite;
}

.loader_message {
  margin-left: 0.5em;
}

.loader_message.blinking {
  animation: blinking_text 1s linear infinite alternate;
}

@keyframes spinner_rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes blinking_text {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
</style>
