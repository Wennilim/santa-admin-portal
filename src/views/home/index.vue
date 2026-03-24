<script lang="ts" setup>
import { computed } from 'vue';
import { revealDraw } from '@/service/api/dashboard';
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

const handleRevealDraw = () => {
  revealDraw();
};

const now = new Date();

const start = new Date(now.getFullYear(), 10, 1);
const end = new Date(now.getFullYear(), 11, 25, 23, 59, 59);

const isRevealPeriod = now >= start && now <= end;
</script>

<template>
  <div class="flex flex-col">
    <div v-if="isRevealPeriod" class="mb-2 flex items-center justify-between bg-amber-100 px-4 py-2">
      <p>{{ $t('page.home.noticeMsg') }}</p>
      <button class="rounded-lg bg-amber-200 p-2" @click="handleRevealDraw">{{ $t('page.home.revealDraw') }}</button>
    </div>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <DonutChart :name="$t('page.home.spinStatus')" :data="spinData" />
      <DonutChart :name="$t('page.home.wishlistStatus')" :data="wishlistData" />
    </div>
  </div>
</template>
