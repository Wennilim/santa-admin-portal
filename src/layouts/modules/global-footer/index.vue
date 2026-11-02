<script setup lang="ts">
defineOptions({
  name: 'GlobalFooter'
});
</script>

<template>
  <DarkModeContainer class="h-full flex-center">
    <a href="" target="_blank" rel="noopener noreferrer">
      Copyright MIT © {{ new Date().getFullYear() }} {{ $t('system.title') }}
    </a>
  </DarkModeContainer>
</template>

<style scoped></style>
