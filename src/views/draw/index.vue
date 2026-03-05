<script lang="ts" setup>
import { h } from 'vue';
import { NButton, NTag } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { type RowData } from 'naive-ui/es/data-table/src/interface';
import { $t } from '@/locales';

// Mock data for employees
const data = [
  { id: 1, name: 'Alice', hasSpin: true, wishlistSent: true },
  { id: 2, name: 'Bob', hasSpin: false, wishlistSent: true },
  { id: 3, name: 'Charlie', hasSpin: true, wishlistSent: false },
  { id: 4, name: 'David', hasSpin: false, wishlistSent: false },
  { id: 5, name: 'Eve', hasSpin: true, wishlistSent: true },
  { id: 6, name: 'Frank', hasSpin: false, wishlistSent: false },
  { id: 7, name: 'Grace', hasSpin: true, wishlistSent: false },
  { id: 8, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 9, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 10, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 11, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 12, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 13, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 14, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 15, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 16, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 17, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 18, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 19, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 20, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 21, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 22, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 23, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 24, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 25, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 26, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 27, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 28, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 29, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 30, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 31, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 32, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 33, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 34, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 35, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 36, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 37, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 38, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 39, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 40, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 41, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 42, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 43, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 44, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 45, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 46, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 47, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 48, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 49, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 50, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 51, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 52, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 53, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 54, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 55, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 56, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 57, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 58, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 59, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 60, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 61, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 62, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 63, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 64, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 65, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 66, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 67, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 68, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 69, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 70, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 71, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 72, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 73, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 74, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 75, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 76, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 77, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 78, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 79, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 80, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 81, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 82, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 83, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 84, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 85, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 86, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 87, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 88, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 89, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 90, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 91, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 92, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 93, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 94, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 95, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 96, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 97, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 98, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 99, name: 'Heidi', hasSpin: false, wishlistSent: true },
  { id: 100, name: 'Heidi', hasSpin: false, wishlistSent: true }
];

const columns: DataTableColumns<RowData> = [
  {
    title: 'ID',
    key: 'id',
    align: 'center'
  },
  {
    title: 'Name',
    key: 'name',
    align: 'center'
  },
  {
    title: () => $t('page.home.spinStatus'),
    key: 'hasSpin',
    align: 'center',
    render(row) {
      return h(
        NTag,
        { type: row.hasSpin ? 'success' : 'error' },
        { default: () => (row.hasSpin ? $t('page.home.hasSpin') : $t('page.home.hasNotSpin')) }
      );
    }
  },
  {
    title: () => $t('page.home.wishlistStatus'),
    key: 'wishlistSent',
    align: 'center',
    render(row) {
      return h(
        NTag,
        { type: row.wishlistSent ? 'success' : 'error' },
        { default: () => (row.wishlistSent ? $t('page.home.wishlistSent') : $t('page.home.wishlistNotSent')) }
      );
    }
  },
  {
    title: () => $t('common.action'),
    key: 'action',
    align: 'center',
    render(row) {
      const disabled = row.hasSpin && row.wishlistSent;
      return h(
        NButton,
        {
          size: 'small',
          type: 'primary',
          disabled,
          onClick: () => {
            window.location.href = `mailto:?subject=Reminder:%20Wishlist%20and%20Spin&body=Hi%20${row.name},%0A%0APlease%20remember%20to%20spin%20and%20send%20your%20wishlist!`;
          }
        },
        { default: () => $t('page.home.sendEmail') }
      );
    }
  }
];
</script>

<template>
  <div class="h-full px-4 py-4">
    <NCard :title="$t('route.draw')" class="h-full rounded-16px shadow-sm" :bordered="false">
      <NDataTable :columns="columns" :data="data" :pagination="{ pageSize: 10 }" :bordered="false" striped />
    </NCard>
  </div>
</template>

<style scoped></style>
