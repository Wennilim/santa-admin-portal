<script setup lang="ts">
defineOptions({
  name: 'AverageScoreCard'
});

const props = defineProps<{
  score: number;
  totalResponses: number;
  scoreLabel: string;
  responsesLabel: string;
}>();
</script>

<template>
  <NCard :bordered="false" class="card-wrapper">
    <div class="flex items-center gap-8">
      <!-- Average Score -->
      <div class="flex flex-col flex-1 items-center justify-center py-4">
        <div class="mb-2 text-sm text-gray-500 op-80">{{ props.scoreLabel }}</div>
        <div class="flex items-baseline gap-1">
          <span class="text-5xl text-primary font-bold">{{ props.score.toFixed(1) }}</span>
          <span class="text-xl text-gray-400">/ 5</span>
        </div>
        <div class="mt-3 flex gap-1">
          <template v-for="i in 5" :key="i">
            <span class="text-2xl" :class="i <= Math.round(props.score) ? 'text-amber-400' : 'text-gray-200'">★</span>
          </template>
        </div>
      </div>

      <!-- Divider -->
      <div class="h-60px w-1px bg-gray-200"></div>

      <!-- Total Responses -->
      <div class="flex flex-col flex-1 items-center justify-center py-4">
        <div class="mb-2 text-sm text-gray-500 op-80">{{ props.responsesLabel }}</div>
        <div class="text-4xl text-primary font-bold">{{ props.totalResponses }}</div>
      </div>
    </div>
  </NCard>
</template>

<style scoped></style>
