<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useDialog, useMessage } from 'naive-ui';
import dayjs from 'dayjs';
import { deleteDraw, generateDraw, getDrawStatus, revealDraw } from '@/service/api/dashboard';
import type { DrawStatus } from '@/service/api/dashboard';
import { getEvent, updateDrawSetting } from '@/service/api/event';
import type { DrawMode } from '@/service/api/event';
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';

const dialog = useDialog();
const message = useMessage();
const appStore = useAppStore();

const loading = ref(true);
const saving = ref(false);
const generating = ref(false);
const revealing = ref(false);
const hasEventConfig = ref(false);
const mode = ref<DrawMode>('manual');
const savedMode = ref<DrawMode>('manual');
const drawDate = ref<number | null>(null);
const savedDate = ref<string | null>(null);
const status = ref<DrawStatus>('pending');
const statusTypeMap = { pending: 'default', generated: 'warning', revealed: 'success' } as const;

const selectedDate = computed(() => (drawDate.value ? dayjs(drawDate.value).format('YYYY-MM-DD') : null));
const isDirty = computed(
  () => mode.value !== savedMode.value || (mode.value === 'auto' && selectedDate.value !== savedDate.value)
);
const canGenerate = computed(
  () => hasEventConfig.value && mode.value === 'manual' && !isDirty.value && status.value === 'pending'
);
const statusType = computed(() => statusTypeMap[status.value]);

async function refreshStatus() {
  const result = await getDrawStatus();
  status.value = result?.status ?? 'pending';
}

onMounted(async () => {
  const [event] = await Promise.all([getEvent(), refreshStatus()]);

  if (event) {
    hasEventConfig.value = true;
    mode.value = event.draw_mode ?? 'manual';
    savedMode.value = mode.value;
    savedDate.value = event.date_draw;
    drawDate.value = event.date_draw ? dayjs(event.date_draw).valueOf() : null;
  } else {
    message.warning($t('page.setting.eventRequired'));
  }

  loading.value = false;
});

async function handleSave() {
  if (mode.value === 'auto' && !selectedDate.value) {
    message.warning($t('page.setting.drawDateRequired'));
    return;
  }

  saving.value = true;
  const date = mode.value === 'auto' ? selectedDate.value : null;
  const result = await updateDrawSetting({ draw_mode: mode.value, date_draw: date });
  saving.value = false;

  if (!result) {
    message.error($t('page.setting.saveFailed'));
    return;
  }

  savedMode.value = mode.value;
  savedDate.value = date;
  message.success($t('page.setting.saveSuccess'));
}

async function handleGenerate() {
  generating.value = true;
  const result = await generateDraw();
  generating.value = false;

  if (!result) {
    message.error($t('page.setting.generateFailed'));
    return;
  }

  await refreshStatus();
  message.success($t('page.setting.generateSuccess'));
}

async function handleReveal() {
  revealing.value = true;
  const result = await revealDraw();
  revealing.value = false;

  if (!result) {
    message.error($t('page.setting.revealFailed'));
    return;
  }

  await refreshStatus();
  message.success($t('page.setting.revealSuccess'));
}

function handleDelete() {
  dialog.warning({
    title: $t('page.setting.deleteConfirmTitle'),
    content: $t('page.setting.deleteConfirmContent'),
    positiveText: $t('common.delete'),
    negativeText: $t('common.cancel'),
    positiveButtonProps: { type: 'error' },
    async onPositiveClick() {
      const result = await deleteDraw();
      if (!result) {
        message.error($t('page.setting.deleteFailed'));
        return false;
      }

      await refreshStatus();
      message.success($t('page.setting.deleteSuccess'));
      return true;
    }
  });
}
</script>

<template>
  <div class="h-full px-4 py-4">
    <NSpin :show="loading">
      <div class="mx-auto max-w-900px flex flex-col gap-4">
        <NCard :title="$t('page.setting.title')" :bordered="false" class="rounded-16px shadow-sm">
          <p class="mb-6 text-gray-500">{{ $t('page.setting.description') }}</p>

          <NForm :label-placement="appStore.isMobile ? 'top' : 'left'" :label-width="appStore.isMobile ? 'auto' : 150">
            <NFormItem :label="$t('page.setting.drawMode')">
              <div class="flex gap-3" :class="appStore.isMobile ? 'flex-col items-start' : 'items-center'">
                <NSwitch v-model:value="mode" class="mode-switch" checked-value="auto" unchecked-value="manual">
                  <template #checked>{{ $t('page.setting.auto') }}</template>
                  <template #unchecked>{{ $t('page.setting.manual') }}</template>
                </NSwitch>
                <span class="text-gray-500 leading-6">
                  {{ mode === 'manual' ? $t('page.setting.manualDescription') : $t('page.setting.autoDescription') }}
                </span>
              </div>
            </NFormItem>

            <NFormItem v-if="mode === 'auto'" :label="$t('page.setting.drawDate')">
              <div class="w-full">
                <NDatePicker v-model:value="drawDate" type="date" class="w-full" :clearable="false" />
                <p class="mt-2 text-sm text-gray-500">{{ $t('page.setting.yearlySchedule') }}</p>
              </div>
            </NFormItem>

            <NFormItem :label="$t('page.setting.currentStatus')">
              <div class="flex items-center gap-3">
                <NTag :type="statusType">{{ $t(`page.setting.status.${status}`) }}</NTag>
                <span v-if="isDirty" class="text-sm text-warning">{{ $t('page.setting.unsaved') }}</span>
              </div>
            </NFormItem>

            <NButton type="primary" :loading="saving" :disabled="!hasEventConfig || !isDirty" @click="handleSave">
              {{ $t('page.setting.save') }}
            </NButton>
          </NForm>
        </NCard>

        <NCard :title="$t('page.setting.actions')" :bordered="false" class="rounded-16px shadow-sm">
          <NAlert v-if="mode === 'auto'" type="info" class="mb-4">
            {{ $t('page.setting.autoActionHint') }}
          </NAlert>

          <NSpace>
            <NButton
              v-if="mode === 'manual'"
              type="primary"
              :loading="generating"
              :disabled="!canGenerate"
              @click="handleGenerate"
            >
              {{ $t('page.setting.generate') }}
            </NButton>
            <NButton type="warning" :loading="revealing" :disabled="status !== 'generated'" @click="handleReveal">
              {{ $t('page.setting.reveal') }}
            </NButton>
            <NButton type="error" secondary :disabled="status === 'pending'" @click="handleDelete">
              {{ $t('page.setting.deleteResult') }}
            </NButton>
          </NSpace>
        </NCard>
      </div>
    </NSpin>
  </div>
</template>

<style scoped>
.mode-switch {
  --n-rail-width: 64px !important;
}
</style>
