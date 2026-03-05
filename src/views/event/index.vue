<script lang="ts" setup>
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
import { $t } from '@/locales';

const dressColor = ref<string[]>([]);

const message = useMessage();

const model = ref({
  budget: null as number | null,
  date: null as number | null,
  location: '',
  dressColor: '',
  itinerary: [] as Array<{ time: string | null; title: string; content: string }>
});

function onCreateItinerary() {
  return {
    time: null,
    title: '',
    content: ''
  };
}

function handleSave() {
  message.success($t('page.event.saveSuccess'));
}
</script>

<template>
  <div class="h-full px-4 py-4">
    <NCard
      :title="$t('page.event.title')"
      class="h-full flex flex-col overflow-hidden rounded-16px shadow-sm"
      :bordered="false"
      content-class="flex-1 overflow-hidden flex flex-col"
    >
      <NScrollbar class="flex-1 pr-2">
        <NForm :model="model" label-placement="left" label-width="120" class="max-w-800px">
          <NFormItem :label="$t('page.event.budget')" path="budget">
            <NInputNumber v-model:value="model.budget" class="w-full">
              <template #prefix>RM</template>
            </NInputNumber>
          </NFormItem>
          <NFormItem :label="$t('page.event.date')" path="date">
            <NDatePicker v-model:value="model.date" type="date" class="w-full" />
          </NFormItem>
          <NFormItem :label="$t('page.event.location')" path="location">
            <NInput v-model:value="model.location" />
          </NFormItem>
          <NFormItem :label="$t('page.event.dressColor')" path="dressColor">
            <TagInput v-model="dressColor" class="w-full" />
          </NFormItem>
          <NFormItem :label="$t('page.event.itinerary')" path="itinerary">
            <NDynamicInput v-model:value="model.itinerary" :on-create="onCreateItinerary">
              <template #create-button-default>
                {{ $t('page.event.addItinerary') }}
              </template>
              <template #default="{ value }">
                <div class="w-full flex flex-col gap-2">
                  <div class="flex items-center gap-4">
                    <NTimePicker
                      v-model:formatted-value="value.time"
                      value-format="HH:mm"
                      format="HH:mm"
                      class="w-120px flex-shrink-0"
                      :placeholder="$t('page.event.itineraryTime')"
                    />
                    <NInput v-model:value="value.title" :placeholder="$t('page.event.itineraryTitle')" class="flex-1" />
                  </div>
                  <NInput
                    v-model:value="value.content"
                    :placeholder="$t('page.event.itineraryContent')"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 5 }"
                  />
                </div>
              </template>
            </NDynamicInput>
          </NFormItem>
          <NSpace justify="center" class="mt-8">
            <NButton type="primary" size="large" class="w-120px" @click="handleSave">
              {{ $t('page.event.save') }}
            </NButton>
          </NSpace>
        </NForm>
      </NScrollbar>
    </NCard>
  </div>
</template>

<style scoped></style>
