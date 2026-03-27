<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { getFeedbackByYear } from '@/service/api/feedback';
import type { FeedbackData } from '@/service/api/feedback';
import { $t } from '@/locales';
import SatisfactionPieChart from './modules/satisfaction-pie-chart.vue';
import ActivityBarChart from './modules/activity-bar-chart.vue';
import ExpectationsChart from './modules/expectations-chart.vue';
import AverageScoreCard from './modules/average-score-card.vue';

const currentYear = new Date().getFullYear();
const selectedYear = ref(currentYear);

const yearOptions = computed(() => {
  const years = [];
  for (let y = currentYear; y >= 2024; y -= 1) {
    years.push({ label: String(y), value: y });
  }
  return years;
});

const feedbackData = ref<FeedbackData | null>(null);
const loading = ref(false);

async function loadData() {
  loading.value = true;
  try {
    const res = await getFeedbackByYear(selectedYear.value);
    feedbackData.value = res;
  } finally {
    loading.value = false;
  }
}

onMounted(() => loadData());
watch(selectedYear, () => loadData());

// Computed chart data
const satisfactionPieData = computed(() => {
  if (!feedbackData.value) return [];
  const ratio = feedbackData.value.overallSatisfactionRatio;
  return [
    { name: $t('page.feedback.satisfied'), value: ratio.satisfied },
    { name: $t('page.feedback.neutral'), value: ratio.neutral },
    { name: $t('page.feedback.dissatisfied'), value: ratio.dissatisfied }
  ];
});

const activityNames = computed(() => {
  if (!feedbackData.value) return [];
  return feedbackData.value.perActivitySatisfaction.map(a => a.activity);
});

const activitySatisfied = computed(() => {
  if (!feedbackData.value) return [];
  return feedbackData.value.perActivitySatisfaction.map(a => a.satisfied);
});

const activityNeutral = computed(() => {
  if (!feedbackData.value) return [];
  return feedbackData.value.perActivitySatisfaction.map(a => a.neutral);
});

const activityDissatisfied = computed(() => {
  if (!feedbackData.value) return [];
  return feedbackData.value.perActivitySatisfaction.map(a => a.dissatisfied);
});
</script>

<template>
  <div class="h-full px-4 py-4">
    <!-- Header: Title + Year Selector -->
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xl font-bold">{{ $t('page.feedback.title') }}</h2>
      <NSelect v-model:value="selectedYear" :options="yearOptions" class="w-120px" size="small" />
    </div>

    <NSpin :show="loading">
      <template v-if="feedbackData">
        <!-- Average Score Card -->
        <div class="mb-4">
          <AverageScoreCard
            :score="feedbackData.averageScore"
            :total-responses="feedbackData.totalResponses"
            :score-label="$t('page.feedback.averageScore')"
            :responses-label="$t('page.feedback.totalResponses')"
          />
        </div>

        <!-- Charts Grid -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SatisfactionPieChart :name="$t('page.feedback.overallSatisfaction')" :data="satisfactionPieData" />
          <ActivityBarChart
            :name="$t('page.feedback.activitySatisfaction')"
            :activities="activityNames"
            :satisfied-data="activitySatisfied"
            :neutral-data="activityNeutral"
            :dissatisfied-data="activityDissatisfied"
            :satisfied-label="$t('page.feedback.satisfied')"
            :neutral-label="$t('page.feedback.neutral')"
            :dissatisfied-label="$t('page.feedback.dissatisfied')"
          />
          <ExpectationsChart
            :name="$t('page.feedback.futureExpectations')"
            :data="feedbackData.futureExpectations"
            class="md:col-span-2"
          />
        </div>
      </template>

      <template v-else-if="!loading">
        <NEmpty :description="$t('page.feedback.noData')" class="mt-20" />
      </template>
    </NSpin>
  </div>
</template>
