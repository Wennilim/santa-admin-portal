<script lang="ts" setup>
import { h } from 'vue';
import { NButton, NPopconfirm, NTag, useMessage } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { deleteUser } from '@/service/api/dashboard';
import { $t } from '@/locales';

interface Props {
  data: any[];
  loading: boolean;
}

defineProps<Props>();

interface Emit {
  (e: 'refresh'): void;
}

const emit = defineEmits<Emit>();
const message = useMessage();

async function handleDelete(id: string) {
  try {
    await deleteUser(id);
    message.success($t('common.deleteSuccess'));
    emit('refresh');
  } catch {
    message.error('Delete failed');
  }
}

const columns: DataTableColumns<any> = [
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
    width: 150
  },
  {
    title: $t('page.home.email'),
    key: 'email',
    align: 'center',
    width: 250
  },
  {
    title: $t('page.home.gender'),
    key: 'gender',
    align: 'center',
    width: 100,
    render(row) {
      const genderKey = `page.home.gender_${row.gender}` as App.I18n.I18nKey;
      return h(
        NTag,
        { type: row.gender === 'male' ? 'info' : 'warning', bordered: false },
        { default: () => $t(genderKey) }
      );
    }
  },
  {
    title: $t('page.home.department'),
    key: 'department',
    align: 'center',
    width: 150,
    render(row) {
      const deptKey = `page.home.dept_${row.department}` as App.I18n.I18nKey;
      return h(NTag, { type: 'default', bordered: false }, { default: () => $t(deptKey) });
    }
  },
  {
    title: $t('common.action'),
    key: 'actions',
    align: 'center',
    width: 100,
    render(row) {
      return h(
        NPopconfirm,
        {
          onPositiveClick: () => handleDelete(row.id)
        },
        {
          trigger: () => h(NButton, { type: 'error', size: 'small' }, { default: () => $t('common.delete') }),
          default: () => $t('common.confirmDelete')
        }
      );
    }
  }
];
</script>

<template>
  <NCard :title="$t('page.home.participants')" :bordered="false" class="mt-4 rounded-16px shadow-sm">
    <NDataTable :columns="columns" :data="data" :loading="loading" :pagination="{ pageSize: 10 }" />
  </NCard>
</template>

<style scoped></style>
