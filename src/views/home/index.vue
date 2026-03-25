<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import type { RowData } from 'naive-ui/es/data-table/src/interface';
import { getAllUsersList, revealDraw } from '@/service/api/dashboard';
import { $t } from '@/locales';
import DonutChart from '@/views/home/modules/donut-chart.vue';
import PieChart from '@/views/home/modules/pie-chart.vue';
import CreativityBanner from '@/views/home/modules/creativity-banner.vue';

const data = ref<RowData[]>([]);

async function getData() {
  const res = await getAllUsersList();
  if (res) {
    data.value = res;
  }
}

onMounted(() => getData());

const spinData = computed(() => {
  const hasSpin = data.value.filter(item => item.hasSpin).length;
  const hasNotSpin = data.value.filter(item => !item.hasSpin).length;
  return [
    { name: $t('page.home.hasSpin'), value: hasSpin },
    { name: $t('page.home.hasNotSpin'), value: hasNotSpin }
  ];
});

const wishlistData = computed(() => {
  const wishlistSent = data.value.filter(item => item.hasSendWishlist).length;
  const wishlistNotSent = data.value.filter(item => !item.hasSendWishlist).length;
  return [
    { name: $t('page.home.wishlistSent'), value: wishlistSent },
    { name: $t('page.home.wishlistNotSent'), value: wishlistNotSent }
  ];
});

const hasSubmitGiftData = computed(() => {
  const hasSubmitGift = data.value.filter(item => item.hasSubmitGift).length;
  const hasNotSubmitGift = data.value.filter(item => !item.hasSubmitGift).length;
  return [
    { name: $t('page.home.hasSubmitGift'), value: hasSubmitGift },
    { name: $t('page.home.hasNotSubmitGift'), value: hasNotSubmitGift }
  ];
});

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
      <PieChart :name="$t('page.home.howManyUserSubmitGiftStatus')" :data="hasSubmitGiftData" />
      <DonutChart :name="$t('page.home.spinStatus')" :data="spinData" />
      <DonutChart :name="$t('page.home.wishlistStatus')" :data="wishlistData" />
      <CreativityBanner />
    </div>
  </div>
</template>
