<script lang="ts" setup>
import { computed, h, onMounted, ref } from 'vue';
import { NCheckbox, NTag } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { type RowData } from 'naive-ui/es/data-table/src/interface';
import { useBoolean } from '@sa/hooks';
import { getAllUsersList, updateSubmitGiftStatus } from '@/service/api/dashboard';
import { $t } from '@/locales';

const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false);
const data = ref<RowData[]>([]);

async function getData() {
  startLoading();
  const res = await getAllUsersList();
  if (res) {
    data.value = res;
  }
  endLoading();
}

onMounted(() => getData());

const sortedData = computed(() => {
  return [...data.value].sort((a, b) => {
    if (a.hasSubmitGift === b.hasSubmitGift) {
      return 0;
    }
    return a.hasSubmitGift ? -1 : 1;
  });
});

const columns: DataTableColumns<RowData> = [
  {
    title: 'ID',
    key: 'id',
    align: 'center',
    width: 60
  },
  {
    title: $t('page.home.name'),
    key: 'fullname',
    align: 'center',
    width: 120
  },
  {
    title: () => $t('page.home.email'),
    key: 'email',
    align: 'center',
    width: 200
  },
  {
    title: () => $t('page.home.spinStatus'),
    key: 'hasSpin',
    align: 'center',
    width: 110,
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
    key: 'hasSendWishlist',
    align: 'center',
    width: 110,
    render(row) {
      return h(
        NTag,
        { type: row.hasSendWishlist ? 'success' : 'error' },
        { default: () => (row.hasSendWishlist ? $t('page.home.wishlistSent') : $t('page.home.wishlistNotSent')) }
      );
    }
  },
  {
    title: () => $t('page.home.hasSubmitGiftStatus'),
    key: 'hasSubmitGift',
    align: 'center',
    width: 100,
    render(row) {
      return h(NCheckbox, {
        checked: row.hasSubmitGift,
        onUpdateChecked: async (value: boolean) => {
          const oldVal = row.hasSubmitGift;
          row.hasSubmitGift = value;

          const res = await updateSubmitGiftStatus(row.id as string, value);
          if (!res) {
            row.hasSubmitGift = oldVal;
            window.$message?.error('Update failed');
          } else {
            window.$message?.success('Status updated');
          }
        }
      });
    }
  }
];
</script>

<template>
  <div class="h-full px-4 py-4">
    <NCard :title="$t('route.draw')" class="h-full rounded-16px shadow-sm" :bordered="false">
      <NDataTable
        :loading="loading"
        :columns="columns"
        :data="sortedData"
        :pagination="{ pageSize: 10 }"
        :bordered="false"
        striped
        :scroll-x="800"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
