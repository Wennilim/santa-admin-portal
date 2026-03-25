<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useMessage } from 'naive-ui';
import { createEvent, getEvent, updateEvent } from '@/service/api/event';
import { $t } from '@/locales';

const message = useMessage();

const model = ref({
  budget: null as number | null,
  date: null as number | null,
  location: '',
  dressColor: [] as string[],
  itinerary: [] as Array<{ time: string | null; title: string; content: string }>
});

const isEventExist = ref(false);

function mapApiToModel(data: any) {
  return {
    budget: data.max_budget ?? null,

    date: data.date_event ? new Date(data.date_event).getTime() : null,

    location: data.location ?? '',

    dressColor: data.costume_color ?? [],

    itinerary: (data.agenda || []).map((item: any) => ({
      time:
        item.time?.hour !== undefined && item.time?.minute !== undefined
          ? `${String(item.time.hour).padStart(2, '0')}:${String(item.time.minute).padStart(2, '0')}`
          : null,

      title: item.title ?? '',
      content: item.content ?? ''
    }))
  };
}

function mapModelToApi() {
  const date = new Date(model.value.date!);

  return {
    max_budget: model.value.budget,

    // 注意：这里建议补零（更标准 ISO）
    date_event: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')}`,

    location: model.value.location,

    costume_color: model.value.dressColor,

    agenda: model.value.itinerary.map(item => {
      const [hour, minute] = item.time ? item.time.split(':') : [null, null];

      return {
        time: {
          hour: hour ? Number(hour) : 0,
          minute: minute ? Number(minute) : 0
        },
        title: item.title,
        content: item.content
      };
    })
  };
}

onMounted(async () => {
  try {
    const res = await getEvent();

    const data = res?.data?.data || res?.data || res;

    if (!data) return;

    isEventExist.value = Boolean(data);

    model.value = mapApiToModel(data);
  } catch (err) {
    console.error(err);
  }
});

function onCreateItinerary() {
  return {
    time: null,
    title: '',
    content: ''
  };
}

async function handleSave() {
  try {
    const submitData = mapModelToApi();

    if (isEventExist.value) {
      await updateEvent(submitData);
    } else {
      await createEvent(submitData);
    }

    message.success($t('page.event.saveSuccess'));
  } catch (err) {
    console.error(err);
    message.error('Save failed');
  }
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
          <!-- Budget -->
          <NFormItem :label="$t('page.event.budget')" path="budget">
            <NInputNumber v-model:value="model.budget" class="w-full">
              <template #prefix>RM</template>
            </NInputNumber>
          </NFormItem>

          <!-- Date -->
          <NFormItem :label="$t('page.event.date')" path="date">
            <NDatePicker v-model:value="model.date" type="date" class="w-full" />
          </NFormItem>

          <!-- Location -->
          <NFormItem :label="$t('page.event.location')" path="location">
            <NInput v-model:value="model.location" />
          </NFormItem>

          <!-- Dress Color -->
          <NFormItem :label="$t('page.event.dressColor')" path="dressColor">
            <TagInput v-model="model.dressColor" class="w-full" />
          </NFormItem>

          <!-- Itinerary -->
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
                    :autosize="{ minRows: 1, maxRows: 5 }"
                  />
                </div>
              </template>
            </NDynamicInput>
          </NFormItem>

          <!-- Submit -->
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
