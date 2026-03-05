<script lang="ts" setup>
import { computed } from 'vue';
import { $t } from '@/locales';
import DonutChart from '@/views/home/modules/donut-chart.vue';

const spinData = computed(() => [
  { name: $t('page.home.hasSpin'), value: 10 },
  { name: $t('page.home.hasNotSpin'), value: 5 }
]);

const wishlistData = computed(() => [
  { name: $t('page.home.wishlistSent'), value: 8 },
  { name: $t('page.home.wishlistNotSent'), value: 7 }
]);
</script>

<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <DonutChart :name="$t('page.home.spinStatus')" :data="spinData" />
    <DonutChart :name="$t('page.home.wishlistStatus')" :data="wishlistData" />
  </div>
</template>
